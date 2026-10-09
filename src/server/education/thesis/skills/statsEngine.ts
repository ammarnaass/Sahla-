/**
 * 🧮 Skill: stats-engine (المحرك الإحصائي الحسابي الدقيق بالكود)
 * مواصفة استوديو المذكرات (PRD النسخة 1.0 - الجزائر)
 * 
 * القاعدة الذهبية:
 * التحليل الإحصائي يُحسب بالكود وليس بالنموذج.
 * لا يُكتب رقم في النص إلا من نتائج هذا المحرك.
 */

export interface NumericVector {
  name: string;
  values: number[];
}

export interface DescriptiveStats {
  count: number;
  mean: number;
  standard_deviation: number;
  variance: number;
  median: number;
  min: number;
  max: number;
}

export interface CorrelationResult {
  var1: string;
  var2: string;
  r: number; // معامل بيرسون
  p_value_est: number;
  interpretation: string; // ارتباط طردي قوي / ضعيف
}

export interface CronbachAlphaResult {
  items_count: number;
  alpha: number;
  is_reliable: boolean; // alpha >= 0.70
  verdict: string;
}

export interface TTestResult {
  mean: number;
  test_value: number;
  t_stat: number;
  df: number; // degrees of freedom
  p_value_est: number;
  is_statistically_significant: boolean; // p < 0.05
  interpretation: string;
}

export interface StatisticalAnalysisSummary {
  descriptive: Record<string, DescriptiveStats>;
  cronbach_alpha?: CronbachAlphaResult;
  correlations: CorrelationResult[];
  t_tests: TTestResult[];
  computed_at: string;
}

export class StatsEngine {
  /**
   * حساب الإحصاء الوصفي بدقة برمجية تامة
   */
  public static calculateDescriptive(values: number[]): DescriptiveStats {
    const valid = values.filter((v) => typeof v === "number" && !isNaN(v));
    const count = valid.length;
    if (count === 0) {
      return { count: 0, mean: 0, standard_deviation: 0, variance: 0, median: 0, min: 0, max: 0 };
    }

    const sum = valid.reduce((acc, v) => acc + v, 0);
    const mean = Math.round((sum / count) * 100) / 100;

    const sorted = [...valid].sort((a, b) => a - b);
    const median =
      count % 2 === 0
        ? Math.round(((sorted[count / 2 - 1] + sorted[count / 2]) / 2) * 100) / 100
        : sorted[Math.floor(count / 2)];

    const varianceSum = valid.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
    const variance = count > 1 ? Math.round((varianceSum / (count - 1)) * 1000) / 1000 : 0;
    const stdDev = Math.round(Math.sqrt(variance) * 100) / 100;

    return {
      count,
      mean,
      standard_deviation: stdDev,
      variance,
      median,
      min: sorted[0],
      max: sorted[count - 1],
    };
  }

  /**
   * حساب معامل ألفا كرونباخ للثبات
   * alpha = (k / (k - 1)) * (1 - sum(item_var) / total_var)
   */
  public static calculateCronbachAlpha(items: NumericVector[]): CronbachAlphaResult {
    const k = items.length;
    if (k < 2) {
      return { items_count: k, alpha: 0, is_reliable: false, verdict: "يتطلب حساب ألفا بندين على الأقل" };
    }

    const n = items[0].values.length;
    const itemVariances = items.map((it) => this.calculateDescriptive(it.values).variance);
    const sumItemVar = itemVariances.reduce((acc, v) => acc + v, 0);

    // مجموع درجات المستجيبين لكل فرد
    const totalScores: number[] = [];
    for (let i = 0; i < n; i++) {
      let respondentTotal = 0;
      for (let j = 0; j < k; j++) {
        respondentTotal += items[j].values[i] || 0;
      }
      totalScores.push(respondentTotal);
    }

    const totalVar = this.calculateDescriptive(totalScores).variance;
    if (totalVar === 0) {
      return { items_count: k, alpha: 0, is_reliable: false, verdict: "تباين إجمالي منعدم" };
    }

    const rawAlpha = (k / (k - 1)) * (1 - sumItemVar / totalVar);
    const alpha = Math.min(1.0, Math.max(0.0, Math.round(rawAlpha * 1000) / 1000));
    const isReliable = alpha >= 0.7;

    return {
      items_count: k,
      alpha,
      is_reliable: isReliable,
      verdict:
        alpha >= 0.9
          ? "ثبات ممتاز جداً (ممتاز للنشر الأكاديمي)"
          : alpha >= 0.8
          ? "ثبات جيد وموثوق"
          : alpha >= 0.7
          ? "ثبات مقبول منهجياً"
          : "ثبات ضعيف يحتاج لمراجعة بنود الاستبيان",
    };
  }

  /**
   * حساب معامل الارتباط بيرسون (Pearson correlation)
   */
  public static calculatePearsonCorrelation(
    vec1: NumericVector,
    vec2: NumericVector
  ): CorrelationResult {
    const n = Math.min(vec1.values.length, vec2.values.length);
    if (n < 3) {
      return { var1: vec1.name, var2: vec2.name, r: 0, p_value_est: 1, interpretation: "حجم العينة غير كافٍ" };
    }

    const d1 = this.calculateDescriptive(vec1.values.slice(0, n));
    const d2 = this.calculateDescriptive(vec2.values.slice(0, n));

    let covarSum = 0;
    for (let i = 0; i < n; i++) {
      covarSum += (vec1.values[i] - d1.mean) * (vec2.values[i] - d2.mean);
    }

    const denominator = Math.sqrt(
      vec1.values.slice(0, n).reduce((a, v) => a + Math.pow(v - d1.mean, 2), 0) *
      vec2.values.slice(0, n).reduce((a, v) => a + Math.pow(v - d2.mean, 2), 0)
    );

    const r = denominator === 0 ? 0 : Math.round((covarSum / denominator) * 1000) / 1000;
    const t = Math.abs(r) * Math.sqrt((n - 2) / Math.max(0.001, 1 - Math.pow(r, 2)));
    const pEst = t > 2.58 ? 0.01 : t > 1.96 ? 0.05 : 0.15;

    let interp = "لا يوجد ارتباط دال";
    if (Math.abs(r) >= 0.7) interp = r > 0 ? "ارتباط طردي قوي ودال إحصائياً" : "ارتباط عكسي قوي ودال إحصائياً";
    else if (Math.abs(r) >= 0.4) interp = r > 0 ? "ارتباط طردي متوسط" : "ارتباط عكسي متوسط";
    else if (Math.abs(r) >= 0.2) interp = "ارتباط ضعيف";

    return {
      var1: vec1.name,
      var2: vec2.name,
      r,
      p_value_est: pEst,
      interpretation: interp,
    };
  }

  /**
   * اختبار ت لعينة واحدة (One-sample t-test)
   */
  public static calculateOneSampleTTest(
    values: number[],
    testValue = 3.0 // المتوسط الفرضي لمقياس ليكرت الخماسي
  ): TTestResult {
    const desc = this.calculateDescriptive(values);
    const n = desc.count;
    const df = Math.max(1, n - 1);
    const se = desc.standard_deviation / Math.sqrt(n);
    const tStat = se === 0 ? 0 : Math.round(((desc.mean - testValue) / se) * 100) / 100;

    const pEst = Math.abs(tStat) > 2.58 ? 0.01 : Math.abs(tStat) > 1.96 ? 0.05 : 0.2;
    const isSig = pEst <= 0.05;

    return {
      mean: desc.mean,
      test_value: testValue,
      t_stat: tStat,
      df,
      p_value_est: pEst,
      is_statistically_significant: isSig,
      interpretation: isSig
        ? `دال إحصائياً عند مستوى دلالة (p < ${pEst})، حيث المتوسط الحسابي (${desc.mean}) أعلى من المتوسط الفرضي (${testValue}) مما يؤكد اتجاه العينة الإيجابي.`
        : `غير دال إحصائياً عند مستوى 0.05، حيث لا توجد فروق جوهرية عن المتوسط الفرضي (${testValue}).`,
    };
  }
}

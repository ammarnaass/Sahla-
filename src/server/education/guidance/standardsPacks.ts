/**
 * 📦 Algerian Standards Packs Registry (حزم المعايير المعتمدة - PRD v1.0)
 * Official curriculum standards, constraints, and rubrics for Algerian education.
 */

import { db } from "@/lib/db";
import { StandardsPack, CurriculumUnit } from "./types";
import { EducationStage } from "../types";

// Built-in Official Algerian Standards Packs (Seed / Master definitions)
export const DEFAULT_STANDARDS_PACKS: StandardsPack[] = [
  {
    pack_id: "AM3-HIST@2026.1",
    stage: "middle",
    level: 3,
    subject: "HISTORY_GEO",
    language: "ar",
    research: {
      pages: { min: 3, max: 6 },
      words_per_page: { min: 180, max: 260 },
      structure: ["cover", "toc", "intro", "body", "conclusion", "references"],
      body_sections: { min: 2, max: 4 },
      style: "simple_clear",
      vocabulary_level: "middle",
      numerals: "western",
      references: {
        allow: [
          "كتاب التاريخ للسنة الثالثة متوسط - الديوان الوطني للمطبوعات المدرسية (ONPS)",
          "الأطلس المدرسي الجزائري الرسمي",
          "المركز الوطني للدراسات والبحث في الحركة الوطنية وثورة أول نوفمبر",
          "الموسوعة الجزائرية الموثقة"
        ],
        forbid_invented: true,
      },
    },
    cover_template: "dz_official_ar",
    curriculum: {
      units: [
        {
          id: "U01",
          title: "الدولة العثمانية والمغرب الأوسط (الجزائر في العهد العثماني)",
          competencies: [
            "التعرف على مراحل نشأة الدولة الجزائرية الحديثة وتنظيمها الإداري والسياسي",
            "فهم طبيعة العلاقات الجزائرية العثمانية ومعارك الأسطول الجزائري في البحر المتوسط",
            "تحليل دور خير الدين بربروس وعروج في حماية السواحل الجزائرية"
          ],
          key_terms: ["الدايات", "البايات", "الإنكشارية", "دار السلطان", "بايلك التيطري", "بايلك الغرب", "بايلك الشرق", "معركة ليبانت"],
          out_of_scope: ["الحرب العالمية الأولى", "تاريخ أوروبا الإقطاعية المعقدة", "الفلسفة الماركسية"]
        },
        {
          id: "U02",
          title: "المقاومة الشعبية والحركة الوطنية في الجزائر",
          competencies: [
            "إبراز أهمية مقاومة الأمير عبد القادر وأحمد باي وفاطمة نسومر",
            "استيعاب المنهج العلمي والتدرج التاريخي للمقاومات المسلحة الوطنية"
          ],
          key_terms: ["معاهدة دي ميشال", "معاهدة التافنة", "محرقة الظهرة", "مقاومة الزعاطشة", "المقراني والشيخ الحداد"],
          out_of_scope: ["مفاوضات إيفيان التفصيلية (خاص بالثالثة ثانوي)", "تكتيكات الحلفاء في الحرب العالمية الثانية"]
        }
      ]
    },
    exam: {
      duration_minutes: 120,
      total_points: 20,
      structure: ["exercise_1", "exercise_2", "integrated_situation"],
      integrated_situation: {
        required: true,
        points: { min: 6, max: 8 }
      },
      difficulty_mix: {
        easy: 0.3,
        medium: 0.5,
        hard: 0.2
      }
    },
    terminology: {
      preferred: {
        "الثورة الجزائرية": "ثورة التحرير الوطني الجزائري (1954-1962)",
        "العثمانيون": "الأيالة الجزائرية في العهد العثماني",
        "المقاومون": "أبطال المقاومات الشعبية الوطنية"
      },
      forbidden: [
        "الاستعمار الإيجابي",
        "الحرب الأهلية الجزائرية للتحرير",
        "القرصنة البربرية"
      ]
    }
  },
  {
    pack_id: "AM4-MATH@2026.1",
    stage: "middle",
    level: 4,
    subject: "MATHS",
    language: "ar",
    research: {
      pages: { min: 2, max: 5 },
      words_per_page: { min: 150, max: 220 },
      structure: ["cover", "intro", "body", "conclusion", "references"],
      body_sections: { min: 2, max: 3 },
      style: "simple_clear",
      vocabulary_level: "middle",
      numerals: "western",
      references: {
        allow: [
          "كتاب الرياضيات للسنة الرابعة متوسط - الجيل الثاني - الديوان الوطني للمطبوعات المدرسية",
          "دليل الأستاذ للرياضيات 4 متوسط"
        ],
        forbid_invented: true
      }
    },
    cover_template: "dz_official_ar",
    curriculum: {
      units: [
        {
          id: "U01",
          title: "الأعداد الطبيعية والأعداد الناطقة وحساب PGCD",
          competencies: [
            "تعيين القاسم المشترك الأكبر لعددين طبيعيين بخوارزمية إقليدس",
            "كتابة كسر على شكل كسر غير قابل للاختزال",
            "التعرف على العددان الأوليان فيما بينهما"
          ],
          key_terms: ["PGCD", "خوارزمية إقليدس", "القسمات المتتالية", "الكسر غير القابل للاختزال", "العددان الأوليان فيما بينهما"],
          out_of_scope: ["الأعداد المركبة", "المعادلات التفاضلية", "علم التوافيق والتباديل"]
        },
        {
          id: "U02",
          title: "الحساب على الجذور التربيعية ونظرية طالس وفيثاغورس",
          competencies: [
            "تبسيط عبارات تتضمن جذورا تربيعية على شكل a√b",
            "توظيف خاصية طالس والخاصية العكسية لحساب الأطوال وإثبات التوازي",
            "حساب النسب المثلثية (cos, sin, tan) في مثلث قائم"
          ],
          key_terms: ["الجذر التربيعي", "خاصية طالس", "فيثاغورس", "جيب تمام", "ظل زاوية"],
          out_of_scope: ["المصفوفات", "الفضاءات الشعاعية ثنائية الأبعاد المتقدمة"]
        }
      ]
    },
    exam: {
      duration_minutes: 120,
      total_points: 20, // BEM standard: 4 + 4 + 4 + 8 = 20
      structure: ["exercise_1", "exercise_2", "exercise_3", "integrated_situation"],
      integrated_situation: {
        required: true,
        points: { min: 8, max: 8 }
      },
      difficulty_mix: {
        easy: 0.35,
        medium: 0.45,
        hard: 0.20
      }
    },
    terminology: {
      preferred: {
        "ق م أ": "PGCD (القاسم المشترك الأكبر)",
        "الوتر": "الوتر في المثلث القائم",
        "المسألة": "وضعية إدماجية مركبة"
      },
      forbidden: ["الأعداد الخيالية", "المحددات الرياضية"]
    }
  },
  {
    pack_id: "AM4-PHYS@2026.1",
    stage: "middle",
    level: 4,
    subject: "PHYSICS",
    language: "ar",
    research: {
      pages: { min: 3, max: 5 },
      words_per_page: { min: 160, max: 240 },
      structure: ["cover", "intro", "body", "conclusion", "references"],
      body_sections: { min: 2, max: 4 },
      style: "simple_clear",
      vocabulary_level: "middle",
      numerals: "western",
      references: {
        allow: [
          "كتاب العلوم الفيزيائية والتكنولوجيا 4 متوسط - الديوان الوطني للمطبوعات المدرسية",
          "المنهاج الرسمي للجيل الثاني - وزارة التربية الوطنية"
        ],
        forbid_invented: true
      }
    },
    cover_template: "dz_official_ar",
    curriculum: {
      units: [
        {
          id: "U01",
          title: "الظواهر الكهربائية والأمن الكهربائي",
          competencies: [
            "تفسير ظاهرة التكهرب وتحديد الشحنات الكهربائية",
            "التمييز بين التيار المستمر والمتناوب الجيبي وتوظيف راسم الاهتزاز المهبطي",
            "تطبيق قواعد الأمن الكهربائي (المأخذ الأرضي، المنصهرة، القاطع التفاضلي)"
          ],
          key_terms: ["التكهرب بالدلك", "التكهرب باللمس", "التكهرب بالتأثير", "التوتر الأعظمي Umax", "التوتر الفعال Ueff", "التواتر f", "المأخذ الأرضي", "المنصهرة"],
          out_of_scope: ["الدوائر RLC المهتزة المتكاملة", "معادلات ماكسويل الكهرومغناطيسية"]
        },
        {
          id: "U02",
          title: "المادة وتحولاتها والمحاليل الشاردية",
          competencies: [
            "تفسير التحليل الكهربائي البسيط لمحلول كلور القصدير أو كلور الزنك",
            "كتابة المعادلات الكيميائية بالصيغة الشاردية والإحصائية وبالمعادلات النصفية"
          ],
          key_terms: ["المحلول الشاردي", "المصعد", "المهبط", "غاز الكلور", "شوارد الزنك", "شوارد الحديد"],
          out_of_scope: ["الكيمياء العضوية المتقدمة", "الحركية الكيميائية والتوازنات المتعددة"]
        }
      ]
    },
    exam: {
      duration_minutes: 90,
      total_points: 20,
      structure: ["exercise_1", "exercise_2", "integrated_situation"],
      integrated_situation: {
        required: true,
        points: { min: 8, max: 8 }
      },
      difficulty_mix: {
        easy: 0.3,
        medium: 0.5,
        hard: 0.2
      }
    },
    terminology: {
      preferred: {
        "الكهرباء المنزلية": "الأمن الكهربائي والشبكة الكهربائية المنزلية (220V/50Hz)",
        "التيار البديل": "التيار الكهربائي المتناوب الجيبي"
      },
      forbidden: ["الأيونات الموجبة الخاطئة التسمية"]
    }
  },
  {
    pack_id: "1AS-PHYS@2026.1",
    stage: "secondary",
    level: 1,
    subject: "PHYSICS",
    language: "ar",
    research: {
      pages: { min: 3, max: 6 },
      words_per_page: { min: 200, max: 280 },
      structure: ["cover", "intro", "body", "conclusion", "references"],
      body_sections: { min: 2, max: 4 },
      style: "standard",
      vocabulary_level: "secondary",
      numerals: "western",
      references: {
        allow: [
          "كتاب العلوم الفيزيائية للسنة الأولى ثانوي - جذع مشترك علوم وتكنولوجيا - ONPS",
          "وثيقة التخفيفات الرسمية للمنهاج الجزائري"
        ],
        forbid_invented: true
      }
    },
    cover_template: "dz_official_ar",
    curriculum: {
      units: [
        {
          id: "U01",
          title: "بنية المادة وهندسة بعض الأفراد الكيميائية",
          competencies: [
            "تمثيل لويس للجزيئات والنموذج الكوكبي للذرة وتطبيق قاعدة الثنائية والثمانية",
            "حساب كمية المادة والكتلة المولية الذرية والجزيئية وقوانين الغازات"
          ],
          key_terms: ["نموذج لويس", "نموذج كرام", "جيليسبي VSEPR", "كمية المادة (n)", "الكتلة المولية (M)", "قانون الغاز المثالي PV=nRT"],
          out_of_scope: ["الأوربيتالات الجزيئية والهندسة الكمومية"]
        }
      ]
    },
    exam: {
      duration_minutes: 120,
      total_points: 20,
      structure: ["exercise_1", "exercise_2", "integrated_situation"],
      integrated_situation: {
        required: true,
        points: { min: 6, max: 8 }
      },
      difficulty_mix: {
        easy: 0.3,
        medium: 0.5,
        hard: 0.2
      }
    },
    terminology: {
      preferred: {
        "المول": "كمية المادة بوحدة المول (mol)",
        "التكافؤ": "الروابط التكافؤية وتشارك الأزواج الإلكترونية"
      },
      forbidden: ["الكوانتم المتقدم"]
    }
  },
  {
    pack_id: "5AP-ARAB@2026.1",
    stage: "primary",
    level: 5,
    subject: "ARABIC",
    language: "ar",
    research: {
      pages: { min: 2, max: 4 },
      words_per_page: { min: 120, max: 180 },
      structure: ["cover", "intro", "body", "conclusion", "references"],
      body_sections: { min: 2, max: 3 },
      style: "simple_clear",
      vocabulary_level: "primary",
      numerals: "western",
      references: {
        allow: [
          "كتاب القراءة واللغة العربية للسنة الخامسة ابتدائي - الجيل الثاني - ONPS",
          "دفتر الأنشطة اللغوية 5 ابتدائي"
        ],
        forbid_invented: true
      }
    },
    cover_template: "dz_official_ar",
    curriculum: {
      units: [
        {
          id: "U01",
          title: "القيم الإنسانية والتضامن الوطني",
          competencies: [
            "التعبير عن التكافل والتعاون بين أفراد المجتمع الجزائري",
            "توظيف القواعد النحوية: الفاعل، المفعول به، كان وأخواتها، إن وأخواتها"
          ],
          key_terms: ["التضامن", "الهلال الأحمر الجزائري", "الإحسان", "الفاعل المرفوع", "الخبر المنصوب"],
          out_of_scope: ["البلاغة المتقدمة والإعراب التقديري الصعب"]
        }
      ]
    },
    exam: {
      duration_minutes: 90,
      total_points: 20,
      structure: ["text_questions", "language_questions", "integrated_situation"],
      integrated_situation: {
        required: true,
        points: { min: 8, max: 8 }
      },
      difficulty_mix: {
        easy: 0.4,
        medium: 0.45,
        hard: 0.15
      }
    },
    terminology: {
      preferred: {
        "التعبير الكتابي": "الوضعية الإدماجية اللغوية",
        "الأسئلة": "البناء الفكري والبناء اللغوي"
      },
      forbidden: ["علم العروض"]
    }
  }
];

export class StandardsPackRepository {
  /**
   * Initializes default standards packs in the database if empty
   */
  static initDatabase() {
    try {
      for (const pack of DEFAULT_STANDARDS_PACKS) {
        db.prepare(`
          INSERT OR REPLACE INTO standards_packs (
            pack_id, stage, level, subject, language, version, data_json, status, updated_at
          ) VALUES (?, ?, ?, ?, ?, '2026.1', ?, 'APPROVED', datetime('now'))
        `).run(
          pack.pack_id,
          pack.stage,
          pack.level,
          pack.subject,
          pack.language,
          JSON.stringify(pack)
        );
      }
    } catch (e) {
      console.error("[StandardsPackRepository] init failed:", e);
    }
  }

  /**
   * Retrieve pack by explicit pack_id
   */
  static getPackById(packId: string): StandardsPack | null {
    try {
      const row = db.prepare(`SELECT data_json FROM standards_packs WHERE pack_id = ?`).get(packId) as any;
      if (row?.data_json) {
        return JSON.parse(row.data_json);
      }
    } catch {
      // Fall back to memory
    }

    const found = DEFAULT_STANDARDS_PACKS.find((p) => p.pack_id === packId);
    return found || null;
  }

  /**
   * Resolve best matching pack given stage, level, subject, language
   */
  static resolvePack(stage: EducationStage, level: number, subject: string, language: string = "ar"): StandardsPack {
    // 1. Try exact in database
    try {
      const row = db.prepare(`
        SELECT data_json FROM standards_packs
        WHERE stage = ? AND level = ? AND subject = ?
        ORDER BY version DESC LIMIT 1
      `).get(stage, level, subject) as any;

      if (row?.data_json) {
        return JSON.parse(row.data_json);
      }
    } catch {
      // Fallback
    }

    // 2. Try in memory defaults
    const match = DEFAULT_STANDARDS_PACKS.find(
      (p) => p.stage === stage && p.level === level && p.subject === subject
    );
    if (match) return match;

    // 3. Fallback matching same subject
    const subjectMatch = DEFAULT_STANDARDS_PACKS.find((p) => p.subject === subject);
    if (subjectMatch) {
      return {
        ...subjectMatch,
        stage,
        level,
        pack_id: `${stage === "primary" ? "AP" : stage === "middle" ? "AM" : "AS"}${level}-${subject}@2026.1`
      };
    }

    // 4. Fallback default
    return DEFAULT_STANDARDS_PACKS[0];
  }

  /**
   * List all packs available
   */
  static listPacks(): StandardsPack[] {
    try {
      const rows = db.prepare(`SELECT data_json FROM standards_packs WHERE status = 'APPROVED'`).all() as any[];
      if (rows && rows.length > 0) {
        return rows.map((r) => JSON.parse(r.data_json));
      }
    } catch {
      // Return defaults
    }
    return DEFAULT_STANDARDS_PACKS;
  }
}

// Auto init on module load
StandardsPackRepository.initDatabase();

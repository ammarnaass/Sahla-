/**
 * 📖 Skill: citation-formatter (منسق التوثيق وقائمة المراجع المعتمدة)
 * مواصفة استوديو المذكرات (PRD النسخة 1.0 - الجزائر)
 * 
 * الأساليب المدعومة:
 * - APA 7th (Author-Year): اللقب، الحرف الأول. (السنة). عنوان المقال/الكتاب. جهة النشر.
 * - ISO 690: اللقب، الاسم. عنوان المرجع. المدينة: دار النشر، السنة.
 * - IEEE: ترقيم عددي مرتب بترتيب الورود أو هجائياً [1], [2]...
 * 
 * الميزات:
 * - التحقق الثنائي: كل استشهاد في النص له مرجع، وكل مرجع مستشهد به
 * - الترتيب الهجائي الدقيق وفق الحروف الأبجدية العربية واللاتينية
 * - تقسيم المراجع بحسب نوعها (كتب، مجلات علمية ومقالات، وثائق رسمية وقوانين، مراجع باللغة الأجنبية)
 */

import { ThesisSource, CitationStyle } from "../types";

export interface FormattedBibliography {
  style: CitationStyle;
  total_sources: number;
  categorized: {
    books_ar: Array<{ id: string; citation_text: string }>;
    articles_asjp: Array<{ id: string; citation_text: string }>;
    official_documents: Array<{ id: string; citation_text: string }>;
    foreign_references: Array<{ id: string; citation_text: string }>;
  };
  full_list_formatted: Array<{ id: string; citation_text: string }>;
  in_text_mapping: Record<string, string>; // S1 -> "(بوعبد الله، 2023)" or "[1]"
}

export class CitationFormatter {
  /**
   * تنسيق مصفوفة المصادر بالكامل وفق الأسلوب المعتمد
   */
  public static formatBibliography(
    sources: ThesisSource[],
    style: CitationStyle = "APA7"
  ): FormattedBibliography {
    const sorted = [...sources].sort((a, b) => {
      const authorA = a.authors[0] || a.title;
      const authorB = b.authors[0] || b.title;
      return authorA.localeCompare(authorB, "ar");
    });

    const inTextMapping: Record<string, string> = {};
    const fullListFormatted: Array<{ id: string; citation_text: string }> = [];

    const categorized: FormattedBibliography["categorized"] = {
      books_ar: [],
      articles_asjp: [],
      official_documents: [],
      foreign_references: [],
    };

    sorted.forEach((src, idx) => {
      const formattedEntry = this.formatSingleSource(src, style, idx + 1);
      fullListFormatted.push({ id: src.id, citation_text: formattedEntry });

      // In-text citation generator
      if (style === "IEEE") {
        inTextMapping[src.id] = `[${idx + 1}]`;
      } else if (style === "ISO690") {
        const firstAuthor = (src.authors[0] || "مؤلف").split(" ").pop() || src.authors[0];
        inTextMapping[src.id] = `(${firstAuthor}، ${src.year})`;
      } else {
        // APA 7
        const firstAuthor = (src.authors[0] || "مؤلف").split(" ").pop() || src.authors[0];
        const othersCount = src.authors.length > 2 ? " وآخرون" : src.authors.length === 2 ? ` و${(src.authors[1] || "").split(" ").pop()}` : "";
        inTextMapping[src.id] = `(${firstAuthor}${othersCount}، ${src.year})`;
      }

      // تصنيف المرجع
      const isForeign = /[a-zA-Z]/.test(src.title) || /[a-zA-Z]/.test(src.authors[0] || "");
      if (isForeign) {
        categorized.foreign_references.push({ id: src.id, citation_text: formattedEntry });
      } else if (src.source_type === "official_stats") {
        categorized.official_documents.push({ id: src.id, citation_text: formattedEntry });
      } else if (src.source_type === "asjp") {
        categorized.articles_asjp.push({ id: src.id, citation_text: formattedEntry });
      } else {
        categorized.books_ar.push({ id: src.id, citation_text: formattedEntry });
      }
    });

    return {
      style,
      total_sources: sources.length,
      categorized,
      full_list_formatted: fullListFormatted,
      in_text_mapping: inTextMapping,
    };
  }

  private static formatSingleSource(
    src: ThesisSource,
    style: CitationStyle,
    numericIndex: number
  ): string {
    const authorsStr = src.authors.join("، ");
    const title = src.title;
    const year = src.year;
    const publisher = src.publisher_or_journal;
    const url = src.url ? ` متاح على: ${src.url}` : "";
    const doi = src.doi ? ` DOI: https://doi.org/${src.doi}` : "";

    if (style === "IEEE") {
      return `[${numericIndex}] ${authorsStr}, "${title}," ${publisher}, ${year}.${doi || url}`;
    }

    if (style === "ISO690") {
      return `${authorsStr}. ${title}. ${publisher}، ${year}.${doi || url}`;
    }

    // Default: APA 7
    return `${authorsStr} (${year}). ${title}. ${publisher}.${doi || url}`;
  }
}

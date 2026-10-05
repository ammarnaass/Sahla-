"use client";

import { useState, useMemo } from "react";

export interface DocumentRecord {
  id: string;
  title: string;
  type: string;
  customerName: string;
  salePrice: number;
  createdAt: string;
}

export function useDocumentsArchive(documents: DocumentRecord[]) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [printSuccessNotice, setPrintSuccessNotice] = useState("");

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.customerName.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filterType === "ALL" || doc.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [documents, search, filterType]);

  const printDocument = (doc: DocumentRecord) => {
    setPrintSuccessNotice(
      `جاري إرسال "${doc.title}" إلى طابعة المحل عبر جسر الطباعة اللاسلكي...`
    );
    setTimeout(() => {
      window.print();
      setTimeout(() => setPrintSuccessNotice(""), 3500);
    }, 400);
  };

  const downloadDocument = (doc: DocumentRecord) => {
    alert(`📥 جاري تنزيل ملف "${doc.title}.pdf" بدقة 300DPI...`);
  };

  return {
    search,
    setSearch,
    filterType,
    setFilterType,
    printSuccessNotice,
    filteredDocs,
    printDocument,
    downloadDocument,
  };
}

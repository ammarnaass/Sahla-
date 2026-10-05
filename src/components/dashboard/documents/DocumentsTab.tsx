"use client";

import React from "react";
import { useDocumentsArchive, type DocumentRecord } from "@/hooks/dashboard/useDocumentsArchive";
import { DocumentsHeader } from "./DocumentsHeader";
import { DocumentsFilterBar } from "./DocumentsFilterBar";
import { DocumentsTable } from "./DocumentsTable";

export type { DocumentRecord };

export interface DocumentsTabProps {
  documents: DocumentRecord[];
  onOpenStudio: (serviceCode: string) => void;
}

export function DocumentsTab({ documents, onOpenStudio }: DocumentsTabProps) {
  const archive = useDocumentsArchive(documents);

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200">
      <DocumentsHeader
        onOpenStudio={onOpenStudio}
        printSuccessNotice={archive.printSuccessNotice}
      />

      <DocumentsFilterBar
        search={archive.search}
        onSearchChange={archive.setSearch}
        filterType={archive.filterType}
        onFilterChange={archive.setFilterType}
      />

      <DocumentsTable
        filteredDocs={archive.filteredDocs}
        onPrint={archive.printDocument}
        onDownload={archive.downloadDocument}
      />
    </div>
  );
}

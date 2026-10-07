"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import {
  FileText,
  GraduationCap,
  Camera,
  Receipt,
  Printer,
  Edit3,
  Clock,
  ArrowLeft,
} from "lucide-react";

export interface DocumentItem {
  id: string;
  title: string;
  type: string;
  customerName?: string;
  createdAt: string;
  salePrice?: number;
}

interface RecentDocumentsProps {
  documents: DocumentItem[];
  onCreateNewDoc: () => void;
}

export function RecentDocuments({ documents, onCreateNewDoc }: RecentDocumentsProps) {
  const [activeActionDoc, setActiveActionDoc] = useState<{
    doc: DocumentItem;
    action: "reprint" | "edit";
  } | null>(null);

  const getDocTypeIcon = (type: string) => {
    switch (type) {
      case "SCHOOL_RESEARCH":
      case "EXAM":
        return <GraduationCap className="w-5 h-5 text-primary" />;
      case "CV":
        return <FileText className="w-5 h-5 text-primary" />;
      case "ID_PHOTO":
        return <Camera className="w-5 h-5 text-primary" />;
      case "INVOICE":
        return <Receipt className="w-5 h-5 text-primary" />;
      default:
        return <FileText className="w-5 h-5 text-primary" />;
    }
  };

  // New account without documents: Show "أنشئ أول وثيقة" card per PRD Section 7.3
  if (documents.length === 0) {
    return (
      <Card className="text-center shadow-xs">
        <CardContent className="p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">لم تقم بإنشاء أي وثيقة بعد</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              ابدأ الآن بإنشاء أول سيرة ذاتية أو بحث مدرسي أو فاتورة لزبائنك برصيدك التجريبي المجاني.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={onCreateNewDoc}
            className="font-bold shadow-md cursor-pointer"
            rightIcon={<ArrowLeft className="w-4 h-4" />}
          >
            <span>أنشئ أول وثيقة لزبونك الآن</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3 text-right">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span>آخر الوثائق المنجزة في محلك</span>
          </h3>
          <Badge variant="neutral" className="text-[11px] font-mono">
            آخر {Math.min(5, documents.length)} وثائق
          </Badge>
        </div>

        <div className="space-y-2.5">
          {documents.slice(0, 5).map((doc) => (
            <Card
              key={doc.id}
              className="hover:border-primary/40 transition-colors shadow-2xs"
            >
              <CardContent className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border">
                    {getDocTypeIcon(doc.type)}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-foreground">{doc.title}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                      {doc.customerName && <span>الزبون: {doc.customerName}</span>}
                      <span>•</span>
                      <span className="font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground/70" />
                        {new Date(doc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Reprint & Edit */}
                <div className="flex items-center gap-2 shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveActionDoc({ doc, action: "reprint" })}
                    leftIcon={<Printer className="w-3.5 h-3.5" />}
                    className="cursor-pointer"
                  >
                    <span>إعادة طباعة</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveActionDoc({ doc, action: "edit" })}
                    leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                    className="cursor-pointer"
                  >
                    <span>تعديل</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Action Simulation Modal */}
      {activeActionDoc && (
        <Modal
          isOpen={Boolean(activeActionDoc)}
          onClose={() => setActiveActionDoc(null)}
          title={
            activeActionDoc.action === "reprint"
              ? `إعادة طباعة: ${activeActionDoc.doc.title}`
              : `تعديل وثيقة: ${activeActionDoc.doc.title}`
          }
        >
          <div className="space-y-4 text-center py-2 text-right">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {activeActionDoc.action === "reprint"
                ? "جسر الطباعة اللاسلكي جاهز. سيتم إرسال الملف مباشرة إلى طابعة المحل أو تحميله بصيغة PDF."
                : "يمكنك تعديل بيانات الزبون وإعادة إصدار الوثيقة مجاناً خلال 72 ساعة."}
            </p>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setActiveActionDoc(null)}
            >
              {activeActionDoc.action === "reprint" ? "بدء الطباعة الآن 🖨️" : "حفظ التعديلات"}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}


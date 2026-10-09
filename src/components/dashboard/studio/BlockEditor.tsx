"use client";

import React, { useState } from "react";
import { DocumentBlock, DocumentAsset, DocumentBlockType } from "@/server/education/formatting/types";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Image as ImageIcon,
  Table as TableIcon,
  Heading,
  AlignLeft,
  Quote,
  List,
  Sparkles,
  Scissors,
  Check,
  ShieldCheck,
  Upload,
} from "lucide-react";

interface BlockEditorProps {
  docId: string;
  blocks: DocumentBlock[];
  assets: DocumentAsset[];
  onBlocksChange: (blocks: DocumentBlock[]) => void;
  onAssetsChange: (assets: DocumentAsset[]) => void;
}

export function BlockEditor({
  docId,
  blocks,
  assets,
  onBlocksChange,
  onAssetsChange,
}: BlockEditorProps) {
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [isSuggestingImageFor, setIsSuggestingImageFor] = useState<string | null>(null);
  const [suggestQuery, setSuggestQuery] = useState("");
  const [suggestCandidates, setSuggestCandidates] = useState<DocumentAsset[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  // Reorder up/down
  const moveBlock = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === blocks.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    // Update order numbers
    newBlocks.forEach((b, i) => {
      b.order_num = i + 1;
    });

    onBlocksChange(newBlocks);

    try {
      await fetch(`/api/docs/${docId}/blocks/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockIds: newBlocks.map((b) => b.id) }),
      });
    } catch (err) {
      console.error("Reorder failed:", err);
    }
  };

  // Add new block
  const addBlock = async (type: DocumentBlockType, afterIndex?: number) => {
    const insertIdx = afterIndex !== undefined ? afterIndex + 1 : blocks.length;
    const newId = `b_${docId}_${Date.now()}`;

    let defaultContent: any = {};
    if (type === "heading") {
      defaultContent = { text: "عنوان جديد", level: 2 };
    } else if (type === "paragraph") {
      defaultContent = { text: "أدخل نص الفقرة الأكاديمية هنا..." };
    } else if (type === "figure") {
      defaultContent = { caption: "شكل توضيحي جديد", figure_number: assets.length + 1 };
    } else if (type === "table") {
      defaultContent = {
        caption: "جدول إحصائي جديد",
        table_data: {
          headers: ["العنصر", "القيمة", "الملاحظات"],
          rows: [
            ["عنصر 1", "100", "ملاحظة"],
            ["عنصر 2", "200", "ملاحظة"],
          ],
        },
      };
    } else if (type === "quote") {
      defaultContent = { text: "اقتباس أكاديمي موثق..." };
    } else if (type === "list") {
      defaultContent = { list_items: ["عنصر أول", "عنصر ثانٍ"], is_ordered: false };
    }

    const newBlock: DocumentBlock = {
      id: newId,
      doc_id: docId,
      order_num: insertIdx + 1,
      type,
      content: defaultContent,
      keep_with_next: type === "heading" || type === "figure",
    };

    const newBlocks = [...blocks];
    newBlocks.splice(insertIdx, 0, newBlock);
    newBlocks.forEach((b, i) => (b.order_num = i + 1));

    onBlocksChange(newBlocks);
    setEditingBlockId(newId);

    try {
      await fetch(`/api/docs/${docId}/blocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBlock),
      });
    } catch (err) {
      console.error("Failed to add block:", err);
    }
  };

  // Delete block
  const deleteBlock = async (blockId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الكتلة؟")) return;
    const newBlocks = blocks.filter((b) => b.id !== blockId);
    newBlocks.forEach((b, i) => (b.order_num = i + 1));
    onBlocksChange(newBlocks);

    try {
      await fetch(`/api/docs/${docId}/blocks/${blockId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Delete block failed:", err);
    }
  };

  // Update block content
  const updateBlock = async (blockId: string, updates: Partial<DocumentBlock>) => {
    const newBlocks = blocks.map((b) => (b.id === blockId ? { ...b, ...updates } : b));
    onBlocksChange(newBlocks);

    try {
      await fetch(`/api/docs/${docId}/blocks/${blockId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error("Update block failed:", err);
    }
  };

  // Request Image suggestions
  const handleSuggestImages = async (block: DocumentBlock) => {
    setIsSuggestingImageFor(block.id);
    setSuggestQuery(block.content.caption || "شكل توضيحي");
    setIsSuggestLoading(true);

    try {
      const res = await fetch(`/api/docs/${docId}/images/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: block.content.caption || "تاريخ الجزائر",
          purpose: "illustrate_event",
          kind: "photo",
        }),
      });
      const data = await res.json();
      if (data.result && data.result.candidates) {
        setSuggestCandidates(data.result.candidates);
      }
    } catch (err) {
      console.error("Image suggestion failed:", err);
    } finally {
      setIsSuggestLoading(false);
    }
  };

  // Select image candidate
  const handleSelectCandidate = async (asset: DocumentAsset, blockId: string) => {
    try {
      const res = await fetch(`/api/docs/${docId}/images/${asset.id}/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockId }),
      });
      const data = await res.json();
      if (data.success) {
        updateBlock(blockId, {
          content: {
            ...blocks.find((b) => b.id === blockId)?.content,
            asset_id: asset.id,
            caption: asset.caption,
            source_attribution: asset.source_attribution,
          },
        });
        onAssetsChange([...assets.filter((a) => a.id !== asset.id), asset]);
        setIsSuggestingImageFor(null);
      }
    } catch (err) {
      console.error("Failed to select asset:", err);
    }
  };

  return (
    <div className="space-y-4 text-right" dir="rtl">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold text-sm text-emerald-950 dark:text-emerald-200">
            محرر الكتل الأكاديمي ({blocks.length} كتلة)
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => addBlock("heading")}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-zinc-800 hover:bg-emerald-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm transition-colors"
          >
            <Heading className="w-3.5 h-3.5 text-emerald-600" />
            + عنوان
          </button>
          <button
            type="button"
            onClick={() => addBlock("paragraph")}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-zinc-800 hover:bg-emerald-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm transition-colors"
          >
            <AlignLeft className="w-3.5 h-3.5 text-emerald-600" />
            + فقرة
          </button>
          <button
            type="button"
            onClick={() => addBlock("figure")}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-zinc-800 hover:bg-emerald-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            + شكل/صورة
          </button>
          <button
            type="button"
            onClick={() => addBlock("table")}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-zinc-800 hover:bg-emerald-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm transition-colors"
          >
            <TableIcon className="w-3.5 h-3.5 text-emerald-600" />
            + جدول
          </button>
        </div>
      </div>

      {/* Blocks List */}
      <div className="space-y-3">
        {blocks.map((block, index) => {
          const isCover = block.type === "cover";
          const boundAsset = assets.find((a) => a.id === block.content.asset_id);

          return (
            <div
              key={block.id}
              className={`p-4 rounded-xl border transition-all ${
                isCover
                  ? "bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 shadow-sm"
              }`}
            >
              {/* Block Header Toolbar */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-100 dark:border-zinc-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold">
                    #{block.order_num}
                  </span>
                  <span className="font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                    {block.type === "cover" && "صفحة الغلاف"}
                    {block.type === "heading" && `عنوان رئيسي (مستوى ${block.content.level || 1})`}
                    {block.type === "paragraph" && "فقرة نصية"}
                    {block.type === "figure" && `شكل/صورة (${block.content.figure_number || 1})`}
                    {block.type === "table" && "جدول إحصائي"}
                    {block.type === "quote" && "اقتباس"}
                    {block.type === "list" && "قائمة عناصر"}
                  </span>
                  {block.page_break_before && (
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 flex items-center gap-1">
                      <Scissors className="w-3 h-3" /> فاصل صفحة
                    </span>
                  )}
                  {block.keep_with_next && (
                    <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300">
                      تلازم (Keep with next)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {/* Up / Down Controls */}
                  <button
                    type="button"
                    onClick={() => moveBlock(index, "up")}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"
                    title="تحريك لأعلى"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(index, "down")}
                    disabled={index === blocks.length - 1}
                    className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"
                    title="تحريك لأسفل"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  {!isCover && (
                    <button
                      type="button"
                      onClick={() => deleteBlock(block.id)}
                      className="p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                      title="حذف الكتلة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Block Content Editor */}
              {block.type === "cover" && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    عنوان الغلاف الرئيسي:
                  </label>
                  <input
                    type="text"
                    value={block.content.text || ""}
                    onChange={(e) =>
                      updateBlock(block.id, {
                        content: { ...block.content, text: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              {block.type === "heading" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <select
                      value={block.content.level || 1}
                      onChange={(e) =>
                        updateBlock(block.id, {
                          content: {
                            ...block.content,
                            level: Number(e.target.value) as any,
                          },
                        })
                      }
                      className="px-2.5 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg"
                    >
                      <option value={1}>المستوى 1 (فصل/مبحث)</option>
                      <option value={2}>المستوى 2 (مطلب/عنصر)</option>
                      <option value={3}>المستوى 3 (فرع)</option>
                    </select>
                    <input
                      type="text"
                      value={block.content.text || ""}
                      onChange={(e) =>
                        updateBlock(block.id, {
                          content: { ...block.content, text: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-2 text-sm font-bold bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {block.type === "paragraph" && (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={block.content.text || ""}
                    onChange={(e) =>
                      updateBlock(block.id, {
                        content: { ...block.content, text: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-sm leading-relaxed bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              {block.type === "figure" && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {boundAsset?.file_url ? (
                      <img
                        src={boundAsset.file_url}
                        alt={boundAsset.alt_text}
                        className="w-32 h-24 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm"
                      />
                    ) : (
                      <div className="w-32 h-24 flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-400 text-xs border border-dashed border-zinc-300 dark:border-zinc-700">
                        <ImageIcon className="w-6 h-6 mb-1" />
                        بلا ملف صورة
                      </div>
                    )}

                    <div className="flex-1 space-y-2 w-full">
                      <div>
                        <label className="text-xs text-zinc-500 block">تعليق الشكل:</label>
                        <input
                          type="text"
                          value={block.content.caption || ""}
                          onChange={(e) =>
                            updateBlock(block.id, {
                              content: { ...block.content, caption: e.target.value },
                            })
                          }
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 block">إسناد المصدر والترخيص:</label>
                        <input
                          type="text"
                          value={block.content.source_attribution || ""}
                          onChange={(e) =>
                            updateBlock(block.id, {
                              content: { ...block.content, source_attribution: e.target.value },
                            })
                          }
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => handleSuggestImages(block)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      اقتراح صور مرخصة
                    </button>
                    {boundAsset && (
                      <span className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {boundAsset.license} ({boundAsset.author})
                      </span>
                    )}
                  </div>

                  {/* Suggest Modal Drawer if active */}
                  {isSuggestingImageFor === block.id && (
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-emerald-300 dark:border-emerald-800 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-800 dark:text-emerald-300">
                          الصور المرشحة ذات الترخيص الحر:
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsSuggestingImageFor(null)}
                          className="text-zinc-500 hover:text-zinc-700"
                        >
                          إغلاق
                        </button>
                      </div>

                      {isSuggestLoading ? (
                        <div className="py-4 text-center text-xs text-zinc-500">
                          جاري البحث في مستودعات ويكيميديا كومنز والأرشيف الأكاديمي...
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {suggestCandidates.map((cand) => (
                            <div
                              key={cand.id}
                              className="p-2 bg-white dark:bg-zinc-900 border rounded-lg space-y-1.5 text-xs"
                            >
                              <div className="font-semibold line-clamp-1">{cand.caption}</div>
                              <div className="text-zinc-500 text-[11px]">{cand.author}</div>
                              <div className="text-emerald-600 text-[10px] font-mono">{cand.license}</div>
                              <button
                                type="button"
                                onClick={() => handleSelectCandidate(cand, block.id)}
                                className="w-full mt-1 py-1 text-xs font-semibold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded transition-colors"
                              >
                                اعتماد هذا الشكل
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Toggles bar */}
              <div className="flex items-center gap-4 mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/50 text-xs text-zinc-600 dark:text-zinc-400">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(block.page_break_before)}
                    onChange={(e) =>
                      updateBlock(block.id, { page_break_before: e.target.checked })
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  فاصل صفحة قبل هذه الكتلة
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(block.keep_with_next)}
                    onChange={(e) =>
                      updateBlock(block.id, { keep_with_next: e.target.checked })
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  التلازم مع ما بعدها (Keep with next)
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 text-center space-y-4 border border-slate-700">
          <h2 className="text-xl font-bold text-rose-400">حدث خطأ غير متوقع!</h2>
          <p className="text-sm text-slate-300">{error.message || "يرجى المحاولة مرة أخرى."}</p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-bold text-white transition cursor-pointer"
          >
            إعادة المحاولة
          </button>
        </div>
      </body>
    </html>
  );
}

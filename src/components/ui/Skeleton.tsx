import React from "react";

export interface SkeletonProps {
  className?: string;
  circle?: boolean;
}

export function Skeleton({ className = "", circle = false }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-slate-800/80 ${circle ? "rounded-full" : "rounded-xl"} ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton circle className="w-12 h-12" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, hasNextPage, hasPrevPage } = pagination;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 py-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevPage}
        className="p-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, idx) => (
        <button
          key={idx}
          onClick={() => (typeof p === 'number' ? onPageChange(p) : null)}
          disabled={p === '...'}
          className={`min-w-[38px] h-[38px] rounded-xl text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
            p === page
              ? 'gradient-brand text-white shadow-md shadow-purple-500/25 font-bold'
              : p === '...'
              ? 'text-slate-400 cursor-default'
              : 'border border-purple-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className="p-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;

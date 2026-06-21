import type { Book } from "../types";
import { BookCard } from "./BookCard";

export function BookGrid({ books, loading }: { books: Book[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="aspect-[3/4] bg-navy/10" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-1/3 rounded bg-navy/10" />
              <div className="h-4 w-full rounded bg-navy/10" />
              <div className="h-4 w-2/3 rounded bg-navy/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!books.length) {
    return (
      <div className="py-16 text-center text-navy/60">
        No books found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

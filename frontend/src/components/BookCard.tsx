import { Link } from "react-router-dom";
import type { Book } from "../types";

function formatPrice(price: string) {
  return `$${parseFloat(price).toFixed(2)}`;
}

function coverUrl(book: Book) {
  if (!book.cover_image) return null;
  if (book.cover_image.startsWith("http")) return book.cover_image;
  return book.cover_image;
}

export function BookCard({ book }: { book: Book }) {
  const cover = coverUrl(book);

  return (
    <Link
      to={`/books/${book.slug}`}
      className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="aspect-[3/4] overflow-hidden bg-navy/5">
        {cover ? (
          <img
            src={cover}
            alt={book.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-navy/10 to-gold/10 p-6 text-center">
            <span className="font-serif text-lg text-navy/60">{book.title}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wider text-navy/50">
          {book.category?.name ?? "General"}
        </p>
        <h3 className="mt-1 font-serif text-lg font-medium leading-tight text-navy line-clamp-2">
          {book.title}
        </h3>
        <p className="mt-1 text-sm text-navy/60 line-clamp-1">
          {book.authors.map((a) => a.name).join(", ") || "Unknown author"}
        </p>
        <p className="mt-3 font-semibold text-gold">{formatPrice(book.price)}</p>
      </div>
    </Link>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { booksApi } from "../api/endpoints";
import { BookGrid } from "../components/BookGrid";
import { useAuth } from "../auth/AuthContext";

export function HomePage() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["books", "featured"],
    queryFn: () => booksApi.list({ ordering: "-created_at" }),
  });

  const books = data?.data.results?.slice(0, 8) ?? [];

  return (
    <div>
      <section className="relative overflow-hidden bg-navy text-cream">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">
            Welcome to
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Stories that stay with you long after the last page
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/70">
            Discover handpicked fiction, essays, course materials and timeless classics in a
            space designed for readers who savor every word.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/catalog" className="btn-primary">
              Browse catalog
            </Link>
            {!isAuthenticated ? (
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-md border border-cream/30 px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-cream/10"
            >
              Create account
            </Link>):(
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-md border border-cream/30 px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-cream/10"
            >
              Become a Host
            </Link>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl text-navy">New arrivals</h2>
            <p className="mt-2 text-navy/60">Fresh picks from our shelves</p>
          </div>
          <Link to="/catalog" className="text-sm font-medium text-gold hover:underline">
            View all
          </Link>
        </div>
        <BookGrid books={books} loading={isLoading} />
      </section>
    </div>
  );
}

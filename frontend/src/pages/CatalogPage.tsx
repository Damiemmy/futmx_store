import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { booksApi } from "../api/endpoints";
import { BookGrid } from "../components/BookGrid";

export function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") ?? "";
  const category = params.get("category") ?? "";

  const { data: booksData, isLoading } = useQuery({
    queryKey: ["books", search, category],
    queryFn: () =>
      booksApi.list({
        ...(search && { search }),
        ...(category && { category }),
      }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => booksApi.categories(),
  });

  const books = booksData?.data.results ?? [];
  const categories = categoriesData?.data.results ?? categoriesData?.data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl text-navy">Catalog</h1>
      <p className="mt-2 text-navy/60">Explore our full collection</p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-64 shrink-0">
          <div className="card p-5">
            <h3 className="font-medium text-navy">Search</h3>
            <input
              type="search"
              placeholder="Title, author, ISBN..."
              className="input-field mt-3"
              value={search}
              onChange={(e) => {
                const next = new URLSearchParams(params);
                if (e.target.value) next.set("search", e.target.value);
                else next.delete("search");
                setParams(next);
              }}
            />

            <h3 className="mt-6 font-medium text-navy">Categories</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const next = new URLSearchParams(params);
                  next.delete("category");
                  setParams(next);
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  !category
                    ? "bg-gold text-navy"
                    : "bg-navy/5 text-navy/70 hover:bg-navy/10"
                }`}
              >
                All
              </button>
              {Array.isArray(categories) &&
                categories.map((cat: { slug: string; name: string }) => (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      const next = new URLSearchParams(params);
                      next.set("category", cat.slug);
                      setParams(next);
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      category === cat.slug
                        ? "bg-gold text-navy"
                        : "bg-navy/5 text-navy/70 hover:bg-navy/10"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <BookGrid books={books} loading={isLoading} />
        </div>
      </div>
    </div>
  );
}

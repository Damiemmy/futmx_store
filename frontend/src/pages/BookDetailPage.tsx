import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { booksApi, cartApi } from "../api/endpoints";
import { useAuth } from "../auth/AuthContext";
import { getErrorMessage } from "../api/client";

export function BookDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["book", slug],
    queryFn: () => booksApi.get(slug!),
    enabled: !!slug,
  });

  const addToCart = useMutation({
    mutationFn: () => cartApi.addItem(data!.data.id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart!");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  
  useEffect(()=>{
    console.log(data)
  },[])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="animate-pulse grid gap-8 lg:grid-cols-2">
          <div className="aspect-[3/4] rounded-xl bg-navy/10" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 rounded bg-navy/10" />
            <div className="h-4 w-1/3 rounded bg-navy/10" />
            <div className="h-32 rounded bg-navy/10" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-serif text-2xl">Book not found</h2>
        <Link to="/catalog" className="btn-primary mt-6 inline-flex">
          Back to catalog
        </Link>
      </div>
    );
  }

  const book = data.data;
  const inStock = book.stock > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="card overflow-hidden">
          {book.cover_image ? (
            <img
              src={book.cover_image}
              alt={book.title}
              className="aspect-[3/4] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-navy/10 to-gold/10 p-12 text-center">
              <span className="font-serif text-3xl text-navy/50">{book.title}</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm uppercase tracking-wider text-navy/50">
            {book.category?.name ?? "General"}
          </p>
          <h1 className="mt-2 font-serif text-4xl text-navy">{book.title}</h1>
          <p className="mt-2 text-lg text-navy/70">
            {book.authors.map((a) => a.name).join(", ") || "Unknown author"}
          </p>
          <p className="mt-4 text-2xl font-semibold text-gold">
            ${parseFloat(book.price).toFixed(2)}
          </p>
          
          {book.is_paid ?(
            <span
              className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                inStock
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {inStock ? `${book.stock} in stock` : "Out of stock"}
            </span>):(
            <span
              className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800`}
            >
             Free Material 
            </span>)
            }

          <p className="mt-8 leading-relaxed text-navy/80">{book.description}</p>

          {inStock && book.is_paid && (
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-md border border-navy/15">
                <button
                  className="px-4 py-2 text-navy/70 hover:text-navy"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button
                  className="px-4 py-2 text-navy/70 hover:text-navy"
                  onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
                >
                  +
                </button>
              </div>

              <button
                className="btn-primary gap-2"
                disabled={addToCart.isPending}
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login?next=/books/" + book.slug);
                    return;
                  }
                  addToCart.mutate();
                }}
              >
                <ShoppingBag className="h-4 w-4" />
                Add to cart
              </button>
            </div>
          )}
          

          {!book.is_paid && !isAuthenticated &&(
            
            <button
              className="btn-primary gap-2"
              onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login?next=/books/" + book.slug);
                    return;
                  }
              }}
            >
              <ShoppingBag className="h-4 w-4" />
              dowload pdf
            </button>
            )}
          {!book.is_paid && isAuthenticated &&(
            <>
              <a href={`${book.pdf}`} download >
                <button
                className="btn-primary gap-2"
                >
                <ShoppingBag className="h-4 w-4" />
                dowload pdf
                </button>
              </a>
            </>
          
          )}
          
        </div>
      </div>
    </div>
  );
}

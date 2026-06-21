import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { cartApi } from "../api/endpoints";
import { getErrorMessage } from "../api/client";

export function CartPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartApi.get(),
  });

  const removeItem = useMutation({
    mutationFn: (id: number) => cartApi.removeItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item removed");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const cart = data?.data;
  const items = cart?.items ?? [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl text-navy">Your cart</h1>

      {items.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-navy/60">Your cart is empty.</p>
          <Link to="/catalog" className="btn-primary mt-6 inline-flex">
            Browse books
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div key={item.id} className="card flex gap-4 p-4">
                <div className="h-24 w-16 shrink-0 overflow-hidden rounded bg-navy/5">
                  {item.book.cover_image && (
                    <img
                      src={item.book.cover_image}
                      alt={item.book.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      to={`/books/${item.book.slug}`}
                      className="font-serif text-lg hover:text-gold"
                    >
                      {item.book.title}
                    </Link>
                    <p className="text-sm text-navy/60">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gold">
                      ${parseFloat(item.subtotal).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem.mutate(item.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card sticky top-24 h-fit p-6">
            <h3 className="font-serif text-xl">Order summary</h3>
            <div className="mt-4 flex justify-between text-navy/70">
              <span>Subtotal</span>
              <span>${parseFloat(cart?.total ?? "0").toFixed(2)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-navy/10 pt-4 text-lg font-semibold">
              <span>Total</span>
              <span className="text-gold">
                ${parseFloat(cart?.total ?? "0").toFixed(2)}
              </span>
            </div>
            <Link to="/checkout" className="btn-primary mt-6 w-full">
              Proceed to checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

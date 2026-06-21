import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { cartApi, ordersApi } from "../api/endpoints";
import { getErrorMessage } from "../api/client";

export function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [address, setAddress] = useState("");

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartApi.get(),
  });

  const checkout = useMutation({
    mutationFn: () => ordersApi.checkout(address),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order placed successfully!");
      navigate(`/orders/${res.data.id}`);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const cart = cartData?.data;
  const items = cart?.items ?? [];

  if (!items.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-serif text-2xl">Nothing to checkout</h1>
        <Link to="/catalog" className="btn-primary mt-6 inline-flex">
          Browse books
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl text-navy">Checkout</h1>

      <div className="card mt-8 p-6">
        <h3 className="font-medium">Shipping address</h3>
        <textarea
          className="input-field mt-3 min-h-[100px] resize-y"
          placeholder="Street, city, state, postal code, country"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <h3 className="mt-8 font-medium">Order review</h3>
        <ul className="mt-4 space-y-2 text-sm text-navy/80">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.book.title} × {item.quantity}
              </span>
              <span>${parseFloat(item.subtotal).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-between border-t border-navy/10 pt-4 text-lg font-semibold">
          <span>Total</span>
          <span className="text-gold">
            ${parseFloat(cart?.total ?? "0").toFixed(2)}
          </span>
        </div>

        <button
          className="btn-primary mt-8 w-full"
          disabled={checkout.isPending || address.length < 10}
          onClick={() => checkout.mutate()}
        >
          {checkout.isPending ? "Processing..." : "Place order"}
        </button>
      </div>
    </div>
  );
}

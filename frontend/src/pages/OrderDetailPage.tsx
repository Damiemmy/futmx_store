import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ordersApi } from "../api/endpoints";

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.get(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="card h-48 animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-serif text-2xl">Order not found</h2>
        <Link to="/orders" className="btn-primary mt-6 inline-flex">
          Back to orders
        </Link>
      </div>
    );
  }

  const order = data.data;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link to="/orders" className="text-sm text-gold hover:underline">
        ← Back to orders
      </Link>
      <h1 className="mt-4 font-serif text-3xl text-navy">Order #{order.id}</h1>
      <p className="mt-2 text-navy/60">
        Placed on {new Date(order.created_at).toLocaleString()}
      </p>

      <div className="card mt-8 p-6">
        <div className="flex justify-between">
          <span className="capitalize font-medium">Status: {order.status}</span>
          <span className="font-semibold text-gold">
            ${parseFloat(order.total).toFixed(2)}
          </span>
        </div>
        <p className="mt-4 text-sm text-navy/70">
          <strong>Shipping to:</strong> {order.shipping_address}
        </p>

        <h3 className="mt-8 font-medium">Items</h3>
        <ul className="mt-4 divide-y divide-navy/10">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between py-3">
              <div>
                <p className="font-medium">{item.book.title}</p>
                <p className="text-sm text-navy/60">Qty: {item.quantity}</p>
              </div>
              <span>${parseFloat(item.subtotal).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

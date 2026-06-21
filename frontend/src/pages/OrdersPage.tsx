import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ordersApi } from "../api/endpoints";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => ordersApi.list(),
  });

  const orders = data?.data.results ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl text-navy">Your orders</h1>

      {isLoading ? (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card h-20 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-12 text-center text-navy/60">
          <p>No orders yet.</p>
          <Link to="/catalog" className="btn-primary mt-6 inline-flex">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="card flex items-center justify-between p-5 transition hover:shadow-md"
            >
              <div>
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-navy/60">
                  {new Date(order.created_at).toLocaleDateString()} ·{" "}
                  {order.items.length} item(s)
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    statusColors[order.status] ?? "bg-navy/10 text-navy"
                  }`}
                >
                  {order.status}
                </span>
                <p className="mt-1 font-semibold text-gold">
                  ${parseFloat(order.total).toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

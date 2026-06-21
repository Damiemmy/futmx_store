import { BookOpen, LogOut, ShoppingBag, User } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import clsx from "clsx";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    "text-sm font-medium transition hover:text-gold",
    isActive ? "text-gold" : "text-navy/80"
  );

export function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  let Athenaeum

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-navy/10 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-gold" />
            {/* <BookOpen className="h-7 w-7 text-[#650877]" /> */}
            <span className="font-serif text-xl font-semibold text-navy">
              FUTMXStore
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/catalog" className={navLinkClass}>
              Catalog
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/orders" className={navLinkClass}>
                  Orders
                </NavLink>
                <NavLink to="/profile" className={navLinkClass}>
                  Profile
                </NavLink>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="rounded-full p-2 text-navy transition hover:bg-navy/5"
                  aria-label="Cart"
                >
                  <ShoppingBag className="h-5 w-5" />
                </Link>
                <span className="hidden text-sm text-navy/70 sm:inline">
                  {user?.username}
                </span>
                <button
                  onClick={() => logout()}
                  className="rounded-full p-2 text-navy/70 transition hover:bg-navy/5 hover:text-navy"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-20 border-t border-navy/10 bg-navy text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gold" />
              <span className="font-serif text-lg">FUTMXStore</span>
            </div>
            <p className="text-sm text-cream/60">
              Curated books for curious minds.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

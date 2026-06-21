import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../api/endpoints";
import { safeAuthAction, useAuth } from "../auth/AuthContext";
import { getErrorMessage } from "../api/client";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") ?? "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await safeAuthAction(() => login(username, password));
      navigate(next);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="card p-8">
        <h1 className="font-serif text-3xl text-navy">Welcome back</h1>
        <p className="mt-2 text-sm text-navy/60">Sign in to your account</p>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-navy">Username</label>
            <input
              className="input-field mt-1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Password</label>
            <input
              type="password"
              className="input-field mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-navy/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-navy/50">or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => authApi.googleLogin()}
          className="btn-secondary w-full"
        >
          Google
        </button>

        <p className="mt-6 text-center text-sm text-navy/60">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-gold hover:underline">
            Join
          </Link>
        </p>
      </div>
    </div>
  );
}

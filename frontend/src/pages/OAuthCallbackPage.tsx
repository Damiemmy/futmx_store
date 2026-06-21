import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../auth/AuthContext";

export function OAuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();

  useEffect(() => {
    const access = params.get("access");
    const refresh = params.get("refresh");

    if (access && refresh) {
      handleOAuthCallback(access, refresh)
        .then(() => navigate("/"))
        .catch(() => {
          toast.error("OAuth login failed");
          navigate("/login");
        });
    } else {
      toast.error("Invalid OAuth callback");
      navigate("/login");
    }
  }, [params, navigate, handleOAuthCallback]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        <p className="mt-4 text-navy/60">Completing sign in...</p>
      </div>
    </div>
  );
}

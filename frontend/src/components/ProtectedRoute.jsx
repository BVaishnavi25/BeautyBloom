import React from "react";
import { Navigate } from "react-router-dom";
import { Flower2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ImageBackground } from "@/components/ui";

export default function ProtectedRoute({ children }) {
  const { user, checking } = useAuth();
  if (checking) {
    return (
      <div className="min-h-screen navy-surface flex items-center justify-center font-body text-stone-300 relative overflow-hidden">
        <ImageBackground scrim="dark" />
        <div className="relative flex flex-col items-center gap-3"><Flower2 className="text-rose-300" size={28} /><div>Loading…</div></div>
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

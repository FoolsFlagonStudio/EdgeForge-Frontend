import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";
import type { MeResponse } from "../../types/users";

interface Props {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

export default function ProtectedRoute({ children, requireSubscription = true }: Props) {
  const [status, setStatus] = useState<"loading" | "ok" | "no-auth" | "no-sub" | "upgrade">(
    "loading",
  );
  const checking = useRef(false);

  useEffect(() => {
    const check = async (session: Session | null) => {
      if (checking.current) return;
      checking.current = true;

      if (!session) {
        setStatus("no-auth");
        checking.current = false;
        return;
      }

      if (!requireSubscription) {
        setStatus("ok");
        checking.current = false;
        return;
      }

      try {
        const me = await apiFetch<MeResponse>(API_ROUTES.me);
        if (me.role === "admin") {
          setStatus("ok");
          return;
        }
        const subStatus = me.subscription?.status;
        if (subStatus === "active" || subStatus === "trialing") {
          setStatus("ok");
        } else if (subStatus === "canceled" || subStatus === "past_due") {
          setStatus("upgrade");
        } else {
          setStatus("no-sub");
        }
      } catch {
        setStatus("no-auth");
      } finally {
        checking.current = false;
      }
    };

    // Initial check — may race with login redirect, so we also subscribe below
    supabase.auth.getSession().then(({ data }) => check(data.session));

    // Catches the case where navigate("/dashboard") fires before getSession() sees the session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus("loading");
      checking.current = false;
      check(session);
    });

    return () => subscription.unsubscribe();
  }, [requireSubscription]);

  if (status === "loading") {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }
  if (status === "no-auth") return <Navigate to="/login" replace />;
  if (status === "no-sub") return <Navigate to="/subscribe" replace />;
  if (status === "upgrade") return <Navigate to="/upgrade" replace />;

  return <>{children}</>;
}

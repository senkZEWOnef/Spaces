"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";

interface SessionContextType {
  session: Session | null;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  loading: true,
});

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!ignore) {
        if (error) console.error("Failed to get session:", error);
        setSession(data.session ?? null);
        setLoading(false);
      }
    };

    load();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        
        setSession(session);
      }
    );

    return () => {
      ignore = true;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
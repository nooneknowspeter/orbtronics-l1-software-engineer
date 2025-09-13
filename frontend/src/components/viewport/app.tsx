"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Navbar, AuthModal } from "@/components/components";
import { AuthProvider } from "@/context/auth-context";

export default function App({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/status", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setAuthenticated(data.authenticated);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="w-screen h-screen justify-center items-center flex flex-row">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );

  return (
    <AuthProvider initialAuthenticated={authenticated}>
      <Navbar />
      <AuthModal mode="login" key="login" id="auth_modal_login" />
      <AuthModal mode="signup" key="signup" id="auth_modal_signup" />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </AuthProvider>
  );
}

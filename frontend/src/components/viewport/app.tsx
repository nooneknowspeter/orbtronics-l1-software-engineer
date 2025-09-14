"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Navbar, AuthModal, TaskModal } from "@/components/components";
import { AuthProvider, UserProvider, TaskProvider } from "@/context/context";
import { LoadingPage } from "@/components/components";

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

  if (loading) return <LoadingPage />;

  return (
    <AuthProvider initialAuthenticated={authenticated}>
      <UserProvider>
        <TaskProvider>
          <Navbar />
          <AuthModal mode="login" key="login" id="auth_modal_login" />
          <AuthModal mode="signup" key="signup" id="auth_modal_signup" />
          <TaskModal mode="create" id="task_modal_create" />
          <TaskModal mode="edit" id="task_modal_edit" />

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
        </TaskProvider>
      </UserProvider>
    </AuthProvider>
  );
}

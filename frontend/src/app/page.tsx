"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function Home() {
  const { authenticated } = useAuth();

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* heading */}
        <motion.h1
          className="lg:text-9xl font-bold md:text-8xl sm:text-7xl text-6xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 12 }}
        >
          MiniTasks
        </motion.h1>

        {/* subtitle */}
        <motion.p
          className="font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          A Simple TODO App
        </motion.p>

        {
          /* button */
          authenticated ? (
            <>
              <motion.button
                className="btn"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={"/dashboard"} className="font-bold">
                  Dashboard
                </Link>
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                className="btn"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                onClick={() =>
                  (
                    document.getElementById(
                      "auth_modal_signup",
                    ) as HTMLDialogElement
                  )?.showModal()
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </>
          )
        }
      </div>
    </motion.div>
  );
}

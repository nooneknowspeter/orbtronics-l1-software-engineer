"use client";
import { FaGithub, FaGripLines } from "react-icons/fa";
import { ThemeController } from "../components";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useUsername } from "@/context/user-context";
import { useEffect } from "react";
import { logOut } from "@/lib/auth";

export default function Navbar() {
  const { authenticated } = useAuth();
  const { username } = useUsername();

  useEffect(() => {
    console.log(username);
  });

  return (
    <div className="navbar shadow-sm">
      <div className="navbar-start">
        <Link className="btn btn-ghost text-xl" href={"/"}>
          MiniTasks
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex"></div>

      <div className="navbar-end gap-4">
        {/* github repo */}
        <button>
          <a
            href="https://github.com/nooneknowspeter/orbtronics-l1-software-engineer"
            target="_blank"
          >
            <FaGithub />
          </a>
        </button>

        <ThemeController />

        {authenticated ? (
          <>
            {/* dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost rounded-field"
              >
                {username}
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm"
              >
                <li>
                  <button className="btn btn-primary" onClick={logOut}>
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* auth */}
            <div className="flex-row gap-4 hidden sm:flex">
              <button
                className="btn"
                onClick={() =>
                  (
                    document.getElementById(
                      "auth_modal_login",
                    ) as HTMLDialogElement | null
                  )?.showModal()
                }
              >
                Log In
              </button>

              <button
                className="btn"
                onClick={() =>
                  (
                    document.getElementById(
                      "auth_modal_signup",
                    ) as HTMLDialogElement
                  )?.showModal()
                }
              >
                Sign Up
              </button>
            </div>

            {/* dropdown */}
            <div className="dropdown dropdown-end sm:hidden">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost rounded-field"
              >
                <FaGripLines />
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm"
              >
                <li>
                  <button className="btn btn-primary" onClick={logOut}>
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useUsername } from "@/context/user-context";
import { logIn, signUp } from "@/lib/lib";
import { useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";

type AuthMode = "signup" | "login";

export default function AuthModal(props: { mode: AuthMode; id: string }) {
  const [currentMode, setMode] = useState<AuthMode>(props.mode);
  const [error, setError] = useState<string | null>(null);
  const { setUsername } = useUsername();

  const authenticate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const email =
      currentMode === "signup" ? (formData.get("email") as string) : undefined;

    try {
      if (currentMode === "login") {
        await logIn(username, password);
      } else {
        await signUp(username, email as string, password);
      }

      setUsername(username);

      (document.getElementById(props.id) as HTMLDialogElement | null)?.close();
    } catch (err) {
      console.error(err);
      setError("Authentication failed");
    }
  };

  useEffect(() => {
    const dialog = document.getElementById(
      props.id,
    ) as HTMLDialogElement | null;
    if (!dialog) return;

    const handleOpen = () => {
      setMode(props.mode);
      setError(null);
    };

    dialog.addEventListener("close", handleOpen);

    return () => {
      dialog.removeEventListener("close", handleOpen);
    };
  }, [props.mode, props.id]);

  return (
    <dialog id={props.id} className="modal">
      {/* close button */}
      <div className="modal-box justify-center">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() =>
            (
              document.getElementById(props.id) as HTMLDialogElement | null
            )?.close()
          }
        >
          x
        </button>

        {/* title */}
        <h3 className="font-bold text-lg">
          {currentMode === "signup" ? "Sign Up" : "Log In"}
        </h3>

        <form onSubmit={authenticate}>
          <fieldset className="fieldset gap-4">
            {/* username */}
            <label className="input validator w-full">
              <FaUser />
              <input
                name="username"
                type="text"
                required
                placeholder="Username"
                pattern="[A-Za-z][A-Za-z0-9\-]*"
                minLength={3}
                maxLength={30}
                title="Only letters, numbers or dash"
              />
            </label>
            <p className="validator-hint hidden w-full">
              Must be 3 to 30 characters
              <br />
              containing only letters, numbers or dash
            </p>

            {/* email */}
            {currentMode === "signup" && (
              <>
                <label className="input validator w-full">
                  <FaEnvelope />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                  />
                </label>
                <div className="validator-hint hidden w-full">
                  Enter valid email address
                </div>
              </>
            )}

            {/* password */}
            <label className="input validator w-full">
              <FaLock />
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                minLength={8}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              />
            </label>
            <p className="validator-hint hidden w-full">
              Must be more than 8 characters, including
              <br />
              At least one number <br />
              At least one lowercase letter <br />
              At least one uppercase letter
            </p>

            {error != null && (
              <>
                <div role="alert" className="alert alert-error alert-soft">
                  <span>Authentication failed!</span>
                </div>
              </>
            )}

            {/* submit */}
            <button type="submit" className="btn btn-neutral mt-4">
              {currentMode === "signup" ? "Sign Up" : "Log In"}
            </button>
          </fieldset>
        </form>

        {/* modes */}
        <div className="flex flex-row justify-center items-center">
          {currentMode === "signup" ? (
            <>
              <span>
                Already have an account?{" "}
                <a
                  className="hover:cursor-pointer font-bold"
                  onClick={() => {
                    setMode("login");
                  }}
                >
                  Log In
                </a>
              </span>
            </>
          ) : (
            <>
              <span>
                {"Don't have an account?"}
                <a
                  className="hover:cursor-pointer font-bold"
                  onClick={() => {
                    setMode("signup");
                  }}
                >
                  Sign Up
                </a>
              </span>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}

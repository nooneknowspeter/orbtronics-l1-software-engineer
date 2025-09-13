export async function logIn(username: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });

  if (!response.ok) throw new Error("Login failed");

  window.location.reload();

  return response.json();
}

export async function signUp(
  username: string,
  email: string,
  password: string,
) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
    credentials: "include",
  });

  if (!response.ok) throw new Error("Sign up failed");

  return response.json();
}

export async function logOut() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) throw new Error("Log out failed");

  window.location.reload();

  return response.json();
}

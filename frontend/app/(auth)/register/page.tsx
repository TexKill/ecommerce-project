"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Реєстрація успішна! Ласкаво просимо.");
        router.push("/login");
      } else {
        toast.error(data.message || "Помилка реєстрації");
      }
    } catch {
      toast.error("Не вдалося з’єднатися з сервером");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-md"
      >
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Реєстрація
        </h2>
        {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full rounded border p-2 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          className="mb-6 w-full rounded border p-2 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 transition"
        >
          Зареєструватися
        </button>
      </form>
    </div>
  );
}

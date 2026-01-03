"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Import AuthContext
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // State for displaying error message
  const { login } = useAuth(); // Get login function
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); // Clear previous errors

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user, data.token); // Update global state
        toast.success("Ви успішно увійшли!");
        router.push("/");
      } else {
        // If backend returned an error (e.g. 401 Invalid credentials)
        const message =
          res.status === 401
            ? "Неправильна пошта або пароль"
            : data.message || "Помилка входу";
        setErrorMsg(message);
        toast.error(message);
      }
    } catch {
      toast.error("Сервер не відповідає");
      setErrorMsg("Не вдалося з’єднатися з сервером");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Вхід</h2>

        {/* Displaying text error message under the title */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm text-center font-medium">
            {errorMsg}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          required
          className={`w-full p-2 mb-4 border rounded text-black outline-none transition-all ${
            errorMsg
              ? "border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-gray-300 focus:ring-1 focus:ring-green-500"
          }`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          required
          className={`w-full p-2 mb-6 border rounded text-black outline-none transition-all ${
            errorMsg
              ? "border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-gray-300 focus:ring-1 focus:ring-green-500"
          }`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition font-bold"
        >
          Увійти
        </button>
      </form>
    </div>
  );
}

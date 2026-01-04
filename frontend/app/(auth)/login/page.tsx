"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch("http://26.34.204.174:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user, data.token);
        toast.success("Ви успішно увійшли!");
        router.push("/");
      } else {
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
    <div className="flex h-[calc(100vh-65px)] w-full items-center justify-center p-4 overflow-hidden bg-slate-950 fixed">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl shadow-black/50 backdrop-blur-sm"
      >
        <h2 className="text-3xl font-black mb-8 text-center text-white uppercase tracking-widest">
          Вхід
        </h2>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-black text-slate-500 ml-4 mb-1">
              Email адреса
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              required
              className={`w-full bg-slate-800/50 border p-4 rounded-2xl text-white outline-none transition-all placeholder:text-slate-600 ${
                errorMsg
                  ? "border-red-500/50 focus:ring-1 focus:ring-red-500/20"
                  : "border-slate-700 focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-black text-slate-500 ml-4 mb-1">
              Пароль
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className={`w-full bg-slate-800/50 border p-4 rounded-2xl text-white outline-none transition-all placeholder:text-slate-600 ${
                errorMsg
                  ? "border-red-500/50 focus:ring-1 focus:ring-red-500/20"
                  : "border-slate-700 focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-4 mt-8 rounded-2xl font-black uppercase tracking-widest hover:bg-green-500 transition-all shadow-lg shadow-green-900/20 active:scale-[0.98]"
        >
          Увійти
        </button>

        <p className="text-center text-slate-500 text-xs mt-8 font-medium">
          Немає акаунту?{" "}
          <Link
            href="/register"
            className="text-green-500 hover:text-green-400 font-bold underline underline-offset-4 transition"
          >
            Створити профіль
          </Link>
        </p>
      </form>
    </div>
  );
}

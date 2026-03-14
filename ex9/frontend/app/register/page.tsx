"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handlRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name,username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    localStorage.setItem("token", data.token);
    router.push("/"); // กลับหน้า quotation
    alert("ลงทะเบียนสำเร็จ!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handlRegister} className="bg-white p-8 rounded-xl shadow-md w-80 space-y-4">
        <h1 className="text-xl font-bold text-center">ลงทะเบียน</h1>
        <input
          className="w-full border px-3 py-2 rounded-lg"
          placeholder="ชื่อ"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full border px-3 py-2 rounded-lg"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full border px-3 py-2 rounded-lg"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer">
          ลงทะเบียน
        </button>
        <div className="w-full rounded-lg">มีบัญชีแล้ว <Link href="/login" className="text-blue-600">เข้าสู่ระบบ</Link></div>
      </form>
    </div>
  );
}
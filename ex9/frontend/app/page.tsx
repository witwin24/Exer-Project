"use client";
import React, { useState, useEffect } from 'react';
import { Trash2, Plus, X, Save, Edit3 } from 'lucide-react';

export default function QuotationPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quotations, setQuotations] = useState([]); // เปลี่ยนชื่อ state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    customer: '', subject: '', deadline: '', type: 'บริการ', status: 'ยังไม่ดำเนินการ'
  });

  const loadQuotations = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/api/quotations", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (res.status === 401 || res.status === 403) {
    setIsLoggedIn(false);
    return;
  }

  const data = await res.json();
  setQuotations(data);
};

 useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) return;

  setIsLoggedIn(true);
  loadQuotations();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId 
      ? `http://localhost:3000/api/quotations/${editingId}`
      : 'http://localhost:3000/api/quotations';
    
    await fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
},
      body: JSON.stringify(formData)
    });

    closeModal();
    loadQuotations();
  };

  const handleDelete = async (id) => {
    if (confirm('ยืนยันการลบใบเสนอราคานี้?')) {
      await fetch(`http://localhost:3000/api/quotations/${id}`, { method: 'DELETE', headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  } });
      loadQuotations();
    }
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ customer: '', subject: '', deadline: '', type: 'บริการ', status: 'ยังไม่ดำเนินการ' });
  };
if (!isLoggedIn) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-lg font-semibold">กรุณาเข้าสู่ระบบก่อน</p>
        <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          ไปหน้า Login
        </a>
      </div>
    </div>
  );
}
  return (
    <div className="p-8 bg-gray-50 min-h-screen text-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">คำขอลูกค้า</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
          <Plus size={20} /> ออกใบเสนอราคาใหม่
        </button>
        {isLoggedIn && (
  <button
    onClick={() => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setQuotations([]);
    }}
    className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
  >
    Logout
  </button>
)}
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">ลูกค้า</th>
              <th className="p-4">หัวข้อ</th>
              <th className="p-4">ต้องการภายในวันที่</th>
              <th className="p-4">ประเภท</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((item, index) => (
              <tr key={item.id ?? index} className="border-b hover:bg-slate-50">
                <td className="p-4 font-mono text-sm">{item.id}</td>
                <td className="p-4">{item.customer}</td>
                <td className="p-4">{item.subject}</td>
                <td className="p-4">{item.deadline}</td>
                <td className="p-4">{item.type}</td>
                <td className="p-4">{item.status}</td>
                <td className="p-4 flex justify-center gap-3">
                  <button onClick={() => openEditModal(item)} className="text-blue-500 cursor-pointer">แก้ไข</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 cursor-pointer">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">{editingId ? 'แก้ไขข้อมูล' : 'เพิ่มคำขอใหม่'}</h2>
              <button onClick={closeModal}><X className="text-gray-400" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ชื่อลูกค้า</label>
                <input required className="w-full border rounded-lg px-3 py-2" value={formData.customer} onChange={(e) => setFormData({...formData, customer: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">หัวข้อ</label>
                <input required className="w-full border rounded-lg px-3 py-2" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
              </div>
              <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">วันที่ต้องการ</label>
                  <input type="date" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none transition" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">ประเภท</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none bg-white" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="บริการ">บริการ</option>
                    <option value="สินค้า">สินค้า</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">สถานะ</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none bg-white" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="ยังไม่ดำเนินการ">ยังไม่ดำเนินการ</option>
                    <option value="ดำเนินโครงการ">ดำเนินโครงการ</option>
                    <option value="ชำระเงินแล้ว">ชำระเงินแล้ว</option>
                  </select>
                </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 flex justify-center gap-2">
                <Save size={20} /> {editingId ? 'อัปเดตข้อมูล' : 'บันทึกข้อมูล'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
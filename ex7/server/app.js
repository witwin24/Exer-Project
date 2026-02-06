const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(express.json());

let quotations = [
  { id: "RQ001", customer: "บริษัท เอ็นอู้จู จำกัด", subject: "แปลบทความ", deadline: "11-12-2025", type: "บริการ", status: "ชำระเงินแล้ว" },
  { id: "RQ002", customer: "บริษัท สนใจ จำกัด", subject: "จัดทำเว็บไซต์", deadline: "15-01-2026", type: "บริการ", status: "ดำเนินโครงการ" },
  { id: "RQ003", customer: "บริษัท สนใจ จำกัด", subject: "ซื้อโน้ตบุ๊ก", deadline: "15-01-2026", type: "สินค้า", status: "ยังไม่ดำเนินการ" }
];

app.get('/', (req, res) => {
  res.send('สวัสดี! Server ทำงานได้ปกติ');
});

// 1. GET: ดึงรายการคำขอทั้งหมด
app.get('/api/quotations', (req, res) => {
  res.json(quotations);
});

// 2. GET:
app.get('/api/quotations/:id', (req, res) => {
  const quotations = quotations.find(r => r.id === req.params.id);
  if (!quotations) return res.status(404).send('ไม่พบข้อมูลคำขอ');
  res.json(quotations);
});

// CREATE:
app.post('/api/quotations', (req, res) => {
  const newReq = { id: `RQ00${quotations.length + 1}`, ...req.body };
  quotations.push(newReq);
  res.status(201).json(newReq);
});

// UPDATE: 
app.put('/api/quotations/:id', (req, res) => {
  const index = quotations.findIndex(r => r.id === req.params.id);
  if (index !== -1) {
    quotations[index] = { ...quotations[index], ...req.body };
    res.json(quotations[index]);
  } else {
    res.status(404).send("ไม่พบข้อมูล");
  }
});

// DELETE: 
app.delete('/api/quotations/:id', (req, res) => {
  quotations = quotations.filter(r => r.id !== req.params.id);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server กำลังรันอยู่ที่ http://localhost:${port}`);
});
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./database.sqlite')

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('สวัสดี! Server ทำงานได้ปกติ');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS quotations (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      customer TEXT,
      subject TEXT,
      deadline TEXT,
      type TEXT,
      status TEXT
    )
  `)
})

// 1. GET All:
app.get('/api/quotations', (req, res) => {
  db.all('SELECT * FROM quotations', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })

    const formatted = rows.map(row => ({
      ...row,
      id: `RQ${String(row.id).padStart(3, '0')}`
    }))

    res.json(formatted)
  })
})
// 2. GET one:
app.get('/api/quotations/:id', (req, res) => {
  const numericId = req.params.id.replace('RQ', '')

  db.get(
    'SELECT * FROM quotations WHERE id = ?',
    [numericId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message })
      if (!row) return res.status(404).send('ไม่พบข้อมูล')

      row.id = `RQ${String(row.id).padStart(3, '0')}`
      res.json(row)
    }
  )
})

// CREATE:
app.post('/api/quotations', (req, res) => {
  const { customer, subject, deadline, type, status } = req.body

  db.run(
    `INSERT INTO quotations (customer, subject, deadline, type, status)
     VALUES (?, ?, ?, ?, ?)`,
    [customer, subject, deadline, type, status],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })

      const rqId = `RQ${String(this.lastID).padStart(3, '0')}`

      res.status(201).json({
        id: rqId,
        customer,
        subject,
        deadline,
        type,
        status
      })
    }
  )
})

// UPDATE: 
app.put('/api/quotations/:id', (req, res) => {
  const { customer, subject, deadline, type, status } = req.body

  const numericId = req.params.id.replace('RQ', '')

  db.run(
    `UPDATE quotations
     SET customer=?, subject=?, deadline=?, type=?, status=?
     WHERE id=?`,
    [customer, subject, deadline, type, status, numericId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      if (this.changes === 0)
        return res.status(404).send('ไม่พบข้อมูล')

      res.json({ message: 'อัปเดตสำเร็จ' })
    }
  )
})

// DELETE: 
app.delete('/api/quotations/:id', (req, res) => {

  const numericId = parseInt(req.params.id.replace('RQ', ''), 10)

if (isNaN(numericId)) {
  return res.status(400).json({ error: 'รูปแบบ ID ไม่ถูกต้อง' })
}

  db.run(
    'DELETE FROM quotations WHERE id = ?',
    [numericId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      if (this.changes === 0)
        return res.status(404).send('ไม่พบข้อมูล')

      res.status(204).send()
    }
  )
})

app.listen(port, () => {
  console.log(`Server กำลังรันอยู่ที่ http://localhost:${port}`);
});


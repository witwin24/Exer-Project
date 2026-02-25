const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./database.sqlite')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const SECRET_KEY = "tMiXppzEPlrj8Qo9Cah3jgcIFAek6Z6M"
const users = [
  {
    id: 1,
    username: "admin",
    password: bcrypt.hashSync("1234", 10)
  }
] 

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
// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  const user = users.find(u => u.username === username)

  if (!user)
    return res.status(401).json({ error: "ไม่พบผู้ใช้" })

  const validPassword = await bcrypt.compare(password, user.password)

  if (!validPassword)
    return res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" })

  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: "1h" }
  )

  res.json({ token })
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token)
    return res.status(401).json({ error: "ไม่มี Token" })

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err)
      return res.status(403).json({ error: "Token ไม่ถูกต้อง" })

    req.user = user
    next()
  })
}

// Get me
app.get('/api/me', authenticateToken, (req, res) => {
  res.json({
    message: "ยินดีต้อนรับ",
    user: req.user
  })
})
// GET All:
app.get('/api/quotations',authenticateToken, (req, res) => {
  db.all('SELECT * FROM quotations', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })

    const formatted = rows.map(row => ({
      ...row,
      id: `RQ${String(row.id).padStart(3, '0')}`
    }))

    res.json(formatted)
  })
})
// GET one:
app.get('/api/quotations/:id',authenticateToken, (req, res) => {
  const numericId = req.params.id.replace('RQ', '')
if (isNaN(numericId)) {
  return res.status(400).json({ error: 'รูปแบบ ID ไม่ถูกต้อง' })
}
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
app.post('/api/quotations',authenticateToken, (req, res) => {
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
app.put('/api/quotations/:id',authenticateToken, (req, res) => {
  const { customer, subject, deadline, type, status } = req.body

  const numericId = req.params.id.replace('RQ', '')
if (isNaN(numericId)) {
  return res.status(400).json({ error: 'รูปแบบ ID ไม่ถูกต้อง' })
}
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
app.delete('/api/quotations/:id',authenticateToken, (req, res) => {

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


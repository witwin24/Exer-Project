const form = document.getElementById("form");
// ฟังก์ชันตรวจสอบว่า id ซ้ำหรือไม่
async function checkMemberExists(id) {
  try {
    const res = await fetch(`https://api.tsukijou.dev/members/${id}`);
    if (res.ok) {
      return true;
    } // ถ้า true = มี id นี้แล้ว, false = ยังไม่มี
  } catch (err) {
      return false;
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = form.elements["id"].value.trim();
  const title = form.elements["title"].value.trim();
  const bio = form.elements["bio"].value.trim();
  const website = form.elements["website"].value.trim();
  const graduated = form.elements["graduated"].value;

  if (!id || !title || !bio || !website || !graduated) {
    alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
    return;
  }

  // ตรวจสอบว่ามี id ซ้ำหรือเปล่า
  const exists = await checkMemberExists(id);
  if (exists) {
    alert("❌ ID นี้ถูกใช้งานแล้ว กรุณาเปลี่ยนใหม่");
    return;
  }
  try {
    await fetch("https://api.tsukijou.dev/members", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id,
        title,
        bio,
        website,
        graduated: graduated === "true",
      }),
    });
    alert("บันทึกสำเร็จ!");
    window.location.href = "api.html";
  } catch (err) {
    console.error("POST error:", err);
    alert("เกิดข้อผิดพลาดในการเพิ่มสมาชิก");
  }
});

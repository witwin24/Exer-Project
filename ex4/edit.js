const form = document.getElementById("form");
const params = new URLSearchParams(window.location.search);
const memberId = params.get("id");

if (memberId) {
  fetch(`https://api.tsukijou.dev/members/${memberId}`)
    .then(res => {
      if (!res.ok) throw new Error("Load member failed");
      return res.json();
    })
    .then(member => {
      form.elements["id"].value = member.id;
      form.elements["title"].value = member.title;
      form.elements["bio"].value = member.bio;
      form.elements["website"].value = member.website;
      form.elements["graduated"].value = String(member.graduated);
    })
    .catch(err => {
      console.error("Preload error:", err);
      alert("ไม่สามารถโหลดข้อมูลสมาชิกได้");
    });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`https://api.tsukijou.dev/members/${form.elements["id"].value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: form.elements["id"].value.trim(),
        title: form.elements["title"].value.trim(),
        bio: form.elements["bio"].value.trim(),
        website: form.elements["website"].value.trim(),
        graduated: form.elements["graduated"].value === "true"
      })
    });
    alert("แก้ไขสำเร็จ!");
    window.location.href = "api.html";
  } catch (err) {
    console.error("PUT error:", err);
    alert("เกิดข้อผิดพลาดในการแก้ไข");
  }
});

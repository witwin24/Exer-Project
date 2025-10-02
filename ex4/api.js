const membersContainer = document.getElementById("members");
const searchInput = document.getElementById("searchInput");
const message = document.getElementById("message");
let members = [];
const params = new URLSearchParams(window.location.search);
const memberId = params.get("id");

async function loadMembers() {
  try {
    const res = await fetch("https://api.tsukijou.dev/members", {
      cache: "no-store"  // ปิด cache
    });
    console.log("status:", res.status);
    if (!res.ok) throw new Error("HTTP error " + res.status);

    const data = await res.json();
    members = data;
    renderMembers(members);
  } catch (err) {
    console.error("Load error:", err);
    message.textContent = "Data loading failed";
  }
}

function escapeHTML(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function renderMembers(list) {
  membersContainer.innerHTML = "";
  message.textContent = "";

  if (list.length === 0) {
    message.textContent = "Not found member";
    return;
  }

  list.forEach((m) => {
    const card = document.createElement("div");
    card.className = "card";

    // ตรวจสอบ website
    let websiteHTML = "";
    if (m.website && m.website.startsWith("http")) {
      websiteHTML = `<a href="${escapeHTML(m.website)}" target="_blank">${escapeHTML(m.website)}</a>`;
    }

    let graduatedHTML = m.graduated
      ? `<span style="color:green;">Yes</span>`
      : `<span style="color:red;">No</span>`;

    card.innerHTML = `
      <h2>${escapeHTML(m.id)}</h2>
      <div class="title">${escapeHTML(m.title)}</div>
      <div class="bio">${escapeHTML(m.bio)}</div>
      <div class="website">${websiteHTML}</div>
      <div class="graduated">Graduated : ${graduatedHTML}</div>
      <div class="bt"><a href="./edit.html?id=${encodeURIComponent(m.id)}">แก้ไข</a><button class="bt-delt">ลบ</button></div>
      
    `;
    const deleteButton = card.querySelector(".bt-delt");
    deleteButton.addEventListener("click", () => deleteMember(m.id));
    membersContainer.appendChild(card);
  });
}
async function deleteMember(id) {
  if (!confirm(`ยืนยันการลบสมาชิก ${id} ?`)) return;
  try{
    await fetch(`https://api.tsukijou.dev/members/${id}`, {
      method: "DELETE"
    });
    alert(`ลบสมาชิก ${id} เรียบร้อย`);
    loadMembers(); // โหลดข้อมูลใหม่
  }catch(err){
    console.error("Delete error:", err);
  }
}




searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = members.filter(
    (m) =>
      m.id.toLowerCase().includes(keyword) ||
      m.name.toLowerCase().includes(keyword)
  );
  renderMembers(filtered);
});

loadMembers();

const membersContainer = document.getElementById("members");
const searchInput = document.getElementById("searchInput");
const message = document.getElementById("message");
let members = [];
const params = new URLSearchParams(window.location.search);
const memberId = params.get("id");

function showLoading() {
  document.getElementById("loading").style.display = "flex";
}

function hideLoading() {
  document.getElementById("loading").style.display = "none";
}

async function loadMembers() {
  try {
    const res = await fetch("https://api.tsukijou.dev/members", {
      cache: "no-store", // ปิด cache
    });
    console.log("status:", res.status);
    if (!res.ok) throw new Error("HTTP error " + res.status);

    const data = await res.json();
    members = data;
    renderMembers(members);
  } catch (err) {
    console.error("Load error:", err);
    message.textContent = "Data loading failed";
  }finally {
    hideLoading();
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
      websiteHTML = `<a href="${escapeHTML(
        m.website
      )}" target="_blank">${escapeHTML(m.website)}</a>`;
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
      <div class="bt"><button  class="bt-edit">แก้ไข</button><button class="bt-delt">ลบ</button></div>
      
    `;
    const deleteButton = card.querySelector(".bt-delt");
    deleteButton.addEventListener("click", () => deleteMember(m.id));
    const editButton = card.querySelector(".bt-edit");

    editButton.addEventListener("click", (e) => {
    loadMemberToEdit(m.id);
    onPopEdit();
});

membersContainer.appendChild(card);

  });
}
async function deleteMember(id) {
  if (!confirm(`ยืนยันการลบสมาชิก ${id} ?`)) return;
  try {
    await fetch(`https://api.tsukijou.dev/members/${id}`, {
      method: "DELETE",
    });
    alert(`ลบสมาชิก ${id} เรียบร้อย`);
    loadMembers(); // โหลดข้อมูลใหม่
  } catch (err) {
    console.error("Delete error:", err);
  }
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = members.filter(
    (m) =>
      m.id.toLowerCase().includes(keyword) ||
      m.title.toLowerCase().includes(keyword)
  );
  renderMembers(filtered);
});

loadMembers();

//////////////////////////////////////////////////////

const formadd = document.getElementById("form-add");
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

formadd.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = formadd.elements["id"].value.trim();
  const title = formadd.elements["title"].value.trim();
  const bio = formadd.elements["bio"].value.trim();
  const website = formadd.elements["website"].value.trim();
  const graduated = formadd.elements["graduated"].value;

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
  } catch (err) {
    console.error("POST error:", err);
    alert("เกิดข้อผิดพลาดในการเพิ่มสมาชิก");
  }
  window.location.href = "single-page-form.html"
  
});

//////////////////////////////////////////////////////////

const formedit = document.getElementById("form-edit");

if (memberId) {
  fetch(`https://api.tsukijou.dev/members/${memberId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Load member failed");
      return res.json();
    })
    .then((member) => {
      formedit.elements["id"].value = member.id;
      formedit.elements["title"].value = member.title;
      formedit.elements["bio"].value = member.bio;
      formedit.elements["website"].value = member.website;
      formedit.elements["graduated"].value = String(member.graduated);
    })
    .catch((err) => {
      console.error("Preload error:", err);
      alert("ไม่สามารถโหลดข้อมูลสมาชิกได้");
    });
}

formedit.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      `https://api.tsukijou.dev/members/${formedit.elements["id"].value}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: formedit.elements["id"].value.trim(),
          title: formedit.elements["title"].value.trim(),
          bio: formedit.elements["bio"].value.trim(),
          website: formedit.elements["website"].value.trim(),
          graduated: formedit.elements["graduated"].value === "true",
        }),
      }
    );
    alert("แก้ไขสำเร็จ!");
  } catch (err) {
    console.error("PUT error:", err);
    alert("เกิดข้อผิดพลาดในการแก้ไข");
  }
  window.location.href = "single-page-form.html"
});


function loadMemberToEdit(id) {
  fetch(`https://api.tsukijou.dev/members/${id}`)
    .then((res) => res.json())
    .then((member) => {
      const formedit = document.getElementById("form-edit");
      formedit.elements["id"].value = member.id;
      formedit.elements["title"].value = member.title;
      formedit.elements["bio"].value = member.bio;
      formedit.elements["website"].value = member.website;
      formedit.elements["graduated"].value = String(member.graduated);
    })
    .catch((err) => console.error("Load member failed:", err));
}



//////////////////////////////
const bt_add = document.getElementById("bt-add");
// const cancel = document.querySelectorAll(".cancel")
const popadd = document.querySelector("#popup-add");
const popedit = document.querySelector("#popup-edit");

bt_add.addEventListener("click", () => {
  onPopAdd();
});
// bt_edit.forEach((loop)=>{
//   loop.addEventListener("click", (event) => {
//    event.preventDefault();
//   onPopEdit();
// });
// })
// cancel.forEach((loop)=>{
//   loop.addEventListener("click", (event) => {
//   onClosePop();
// });
// })



    function onPopAdd() {
      popadd.style.display = "flex";
    }
    function onPopEdit() {
      popedit.style.display = "flex";
    }
    function onCloseAdd() {
      popadd.style.display = "none";
    }
    function onCloseEdit() {
      popedit.style.display = "none";
    }
    // function onClosePop() {
    //   popadd.style.display = "none";
    //   popedit.style.display = "none";
    // }

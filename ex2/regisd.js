const regname = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const registorlist = document.getElementById("regisList");
const thead = document.getElementById("thead");
const tbody = document.getElementById("tbody");

document.addEventListener("DOMContentLoaded", renderUI);

function renderUI() {
    const savedItems = JSON.parse(localStorage.getItem("registorList")) || [];

    // ถ้าไม่มี item
    if (savedItems.length === 0) {
        registorlist.innerHTML = `<tr><td colspan="3" style="text-align:center;">Not Found Data !!</td></tr>`;
        return;
    }
    thead.innerHTML = `<tr>
    <th>Name</th> 
    <th>Email</th> 
    <th>Phone Number</th> 
    <th>Action</th> 
    </tr>`;

    for (let i = 0; i < savedItems.length; i++) {
        tbody.innerHTML += `
            <tr>
                <td>${savedItems[i].name}</td>
                <td>${savedItems[i].email}</td>
                <td>${savedItems[i].phone}</td>
                <td><button class="delete-btn" onclick="deleteItem(${savedItems[i].id})">Delete</button></td>
            </tr>`;
    };
}


function deleteItem(id) {
const isConfirmed = confirm('ต้องการลบข้อมูลใช่หรือไม่');

    if (!isConfirmed) return; // ถ้าไม่ยืนยัน ให้ยกเลิก
    let savedItems = JSON.parse(localStorage.getItem("registorList") || []);
    savedItems = savedItems.filter(item => (item.id != id));
    localStorage.setItem("registorList", JSON.stringify(savedItems));

    alert('ลบข้อมูลสำเร็จ!!');

    renderUI();
}

document.getElementById("search-btn").addEventListener("click", searchTable);

function searchTable() {
    const savedItems = JSON.parse(localStorage.getItem("registorList")) || [];

    const input = document.getElementById("searchInput").value.toLowerCase();
    const table = document.getElementById("regisList");
    const trs = table.getElementsByTagName("tr");

    let found = false;

    for (let i = 1; i < trs.length; i++) {
        const tds = trs[i].getElementsByTagName("td");
        if (tds.length === 0) continue;

        const name = tds[0].textContent.toLowerCase();
        const email = tds[1].textContent.toLowerCase();
        const phone = tds[2].textContent.toLowerCase();

        if (name.includes(input) || email.includes(input) || phone.includes(input)) {
            trs[i].style.display = "";
            found = true; // เจออย่างน้อย 1
        } else {
            trs[i].style.display = "none";
        }
    }

    // ถ้าหลัง loop แล้วยังไม่เจออะไรเลย → แจ้งเตือน
    if (!found && input !== "") {
        alert("Not Found Data !!");
    }
}

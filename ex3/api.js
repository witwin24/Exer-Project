 const membersContainer = document.getElementById("members");
    const searchInput = document.getElementById("searchInput");
    const message = document.getElementById("message");
    let members = [];

    async function loadMembers() {
      try {
        const res = await fetch("https://api.tsukijou.dev/members");
        members = await res.json();
        renderMembers(members);
      } catch (err) {
        message.textContent = "Data loading failed";
      }
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
        card.innerHTML = `
          <h2>${m.id}</h2>
          <div class="title">${m.title}</div>
          <div class="bio">${m.bio}</div>
          <div class="website">
            
            <a href="${m.website}" target="_blank">${m.website}</a>
                
            
          </div>
          <div class="graduated ">Graduated : ${m.graduated}</div>
        `;
        membersContainer.appendChild(card);
      });
    }

    searchInput.addEventListener("input", () => {
      const keyword = searchInput.value.toLowerCase();
      const filtered = members.filter((m) =>
        m.id.toLowerCase().includes(keyword) ||
        m.title.toLowerCase().includes(keyword)
      );
      renderMembers(filtered);
    });
    
    loadMembers();
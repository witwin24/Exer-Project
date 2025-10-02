const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
try{
    await fetch('https://api.tsukijou.dev/members', {
    method: 'POST',
    headers:{'content-type':'application/json'},
    body:JSON.stringify({
        id: form.elements["id"].value.trim(),
        title: form.elements["title"].value.trim(),
        bio: form.elements["bio"].value.trim(),
        website: form.elements["website"].value.trim(),
        graduated: form.elements["graduated"].value === "true"
      })
});
}catch(err){
    console.error('POST error:',err);
    alert('เกิดข้อผิดพลาดในการเพิ่มสมาชิก');
}
});
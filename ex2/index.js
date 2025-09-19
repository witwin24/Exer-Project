const regname = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");

function register() {
  const nameVal = regname.value.trim();
  const emailVal = email.value.trim();
  const phoneVal = phone.value.trim();

  const isOnlySpecialChars = /^[^a-zA-Zก-๙]+$/.test(nameVal);
  const isOnlyNumbers = /^[0-9]+$/.test(nameVal);
  const isValidPhone = /^0[0-9]{9}$/.test(phoneVal);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);

  if (!nameVal || isOnlySpecialChars || isOnlyNumbers || !isValidEmail || !isValidPhone) {
    alert('กรุณากรอกข้อมูลให้ถูกต้อง:\n- ชื่อห้ามเป็นตัวเลขหรือตัวอักษรพิเศษล้วน\n- อีเมลถูกต้อง\n- เบอร์โทรขึ้นต้นด้วย 0 และ 10 หลัก');
    return;
  }

  const itemOb = JSON.parse(localStorage.getItem("registorList")) || [];
  const uniqueId = Date.now();
  itemOb.push({ id: uniqueId, name: regname.value, email: email.value, phone: phone.value });
  localStorage.setItem("registorList", JSON.stringify(itemOb));

  regname.value = '';
  email.value = '';
  phone.value = '';
  
  alert('ลงทะเบียนสำเร็จ!!');

}


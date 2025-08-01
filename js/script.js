const SHEET_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzylAPVfvUj8uCDBCr94AuwEn_W8_WDnR0LoN-Hp3y1RobUMYwAHr4ka6PBOTYdMzXDVw/exec'; // Reemplaza con tu URL de Apps Script publicada

async function getSheetData() {
  try {
    const res = await fetch(SHEET_SCRIPT_URL);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error al obtener los datos:', err);
    return [];
  }
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const users = await getSheetData();

    const user = users.find(u => u.usuario === username && u.clave === password);

    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
      window.location.href = 'dashboard.html';
    } else {
      document.getElementById('login-error').innerText = 'Usuario o clave incorrectos';
    }
  });
}

const userData = JSON.parse(localStorage.getItem('userData'));
if (userData && document.body.classList.contains('dashboard-page')) {
  document.getElementById('user-name').innerText = userData.nombre;
  document.getElementById('nombre').innerText = userData.nombre;
  document.getElementById('apellido').innerText = userData.apellido;
  document.getElementById('correo').innerText = userData.correo;
  document.getElementById('ingresos').innerText = userData.ingresos;
  document.getElementById('egresos').innerText = userData.egresos;

  const solicitudes = document.getElementById('solicitudes');
  Object.keys(userData).forEach(key => {
    if (key.startsWith('solicitud')) {
      const li = document.createElement('li');
      li.textContent = userData[key];
      solicitudes.appendChild(li);
    }
  });
} else if (document.body.classList.contains('dashboard-page')) {
  window.location.href = 'index.html';
}

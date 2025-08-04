const SHEET_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzylAPVfvUj8uCDBCr94AuwEn_W8_WDnR0LoN-Hp3y1RobUMYwAHr4ka6PBOTYdMzXDVw/exe'; // reemplaza con tu URL real

async function getSheetData() {
  try {
    const res = await fetch(SHEET_SCRIPT_URL);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error al obtener datos:', err);
    return [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      const errorElem = document.getElementById('login-error');

      errorElem.textContent = 'Verificando...';

      const users = await getSheetData();
      const user = users.find(u => u.usuario === username && u.clave === password);

      if (user) {
        localStorage.setItem('userData', JSON.stringify(user));
        window.location.href = 'dashboard.html';
      } else {
        errorElem.textContent = 'Usuario o clave incorrectos';
      }
    });
  }

  const userData = JSON.parse(localStorage.getItem('userData'));
  if (userData && document.body.classList.contains('dashboard-page')) {
    document.getElementById('username').textContent = userData.username;
    document.getElementById('nombre').textContent = userData.nombre;
    document.getElementById('apellido').textContent = userData.apellido;
    document.getElementById('correo').textContent = userData.correo;
    document.getElementById('ingresos').textContent = userData.ingresos;
    document.getElementById('egresos').textContent = userData.egresos;

    const solicitudes = document.getElementById('solicitudes');
    Object.entries(userData).forEach(([key, val]) => {
      if (key.toLowerCase().startsWith('solicitud')) {
        const li = document.createElement('li');
        li.textContent = val;
        solicitudes.appendChild(li);
      }
    });
  }
});
function cerrarSesion() {
  localStorage.removeItem('userData');
  window.location.href = 'index.html';
}


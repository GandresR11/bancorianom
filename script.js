const SHEET_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzylAPVfvUj8uCDBCr94AuwEn_W8_WDnR0LoN-Hp3y1RobUMYwAHr4ka6PBOTYdMzXDVw/exec'; // reemplaza con tu URL real

async function getSheetData() {
  try {
    const res = await fetch(SHEET_SCRIPT_URL);
    const data = await res.json();
   console.log(data);
   console.log(res);
  console.log('Respuesta RAW del Apps Script:', data); // ✅ VER EN CONSOLA
    return data;
  } catch (err) {
    console.error('Error al obtener datos:', err);
    return data;
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
   //   console.log(username);
    //  console.log(password);

      errorElem.textContent = 'Verificando...';

      const users = await getSheetData();
      console.log('Info recibida' , users);
      const user = users.find(u => 
  u.username.trim() === username.trim() &&
  String(u.password).trim() === String(password).trim()
);
      console.log(user)

      if (user) {
        localStorage.setItem('userData', JSON.stringify(user));
        window.location.href = 'dashboard.html';
      } else {
        errorElem.textContent = 'Usuario o clave incorrectos';
      }
    });
  }

  const userData = JSON.parse(localStorage.getItem('userData'));
  console.log(userData);
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


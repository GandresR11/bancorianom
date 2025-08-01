const SHEET_URL = 'https://docs.google.com/spreadsheets/d/13H0POzXRXQ57pizP1WNYb6Wu7XdTZXIdNz71QNWtHXE/gviz/tq?tqx=out:json&sheet=Usuarios';

async function getSheetData() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();
  const json = JSON.parse(text.substring(47).slice(0, -2));
  const cols = json.table.cols.map(c => c.label.toLowerCase().replace(/\s+/g, ''));
  const rows = json.table.rows.map(row =>
    row.c.reduce((obj, val, i) => {
      obj[cols[i]] = val ? val.v : '';
      return obj;
    }, {})
  );
  return rows;
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

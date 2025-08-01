const SHEET_URL = 'https://spreadsheets.google.com/feeds/list/13H0POzXRXQ57pizP1WNYb6Wu7XdTZXIdNz71QNWtHXE/od6/public/values?alt=json';

const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const res = await fetch(SHEET_URL);
    const data = await res.json();
    const entries = data.feed.entry;

    const user = entries.find(row => row.gsx$usuario.$t === username && row.gsx$clave.$t === password);

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
  document.getElementById('user-name').innerText = userData.gsx$nombre.$t;
  document.getElementById('nombre').innerText = userData.gsx$nombre.$t;
  document.getElementById('apellido').innerText = userData.gsx$apellido.$t;
  document.getElementById('correo').innerText = userData.gsx$correo.$t;
  document.getElementById('ingresos').innerText = userData.gsx$ingresos.$t;
  document.getElementById('egresos').innerText = userData.gsx$egresos.$t;

  const solicitudes = document.getElementById('solicitudes');
  Object.keys(userData).forEach(key => {
    if (key.startsWith('gsx$solicitud')) {
      const li = document.createElement('li');
      li.textContent = userData[key].$t;
      solicitudes.appendChild(li);
    }
  });
} else if (document.body.classList.contains('dashboard-page')) {
  window.location.href = 'index.html';
}

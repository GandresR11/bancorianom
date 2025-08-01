<!-- ===================== js/login.js ===================== -->
/*
  Demo login: consulta la pestaña "ingresos" para validar.
  Tras login exitoso, redirige a profile.html
*/
const form = document.getElementById('loginForm');
const statusEl = document.getElementById('loginStatus');

const SHEET_ID  = '1_PVAMz08cWlU8hvcvwIRuyMTskB5DT-zwP2nTY5DQd4';
const LOGIN_TAB = 'ingresos';
const LOGIN_URL = `https://opensheet.elk.sh/${SHEET_ID}/${LOGIN_TAB}`;

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const user = data.get('user');
  const pass = data.get('pass');
  statusEl.textContent = 'Verificando…';
  try {
    const resp = await fetch(LOGIN_URL);
    if (!resp.ok) throw new Error('Network error');
    const rows = await resp.json();
    const found = rows.find(r => r.user === user && r.pass === pass);
    if (found) {
      localStorage.setItem('session', JSON.stringify(found));
      // redirigir al perfil
      window.location.href = 'profile.html';
    } else {
      statusEl.textContent = 'Credenciales incorrectas';
    }
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Error de conexión';
  }
});

/*
- Columnas requeridas en "ingresos": user | pass | nombre
*/

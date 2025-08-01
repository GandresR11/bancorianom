<!-- ===================== js/profile.js ===================== -->
/*
  Carga datos de la pestaña "perfiles" para el usuario autenticado
  columnas recomendadas: user | nombre | email | bio | foto
*/
const SHEET_ID  = '1_PVAMz08cWlU8hvcvwIRuyMTskB5DT-zwP2nTY5DQd4';
const PROFILE_TAB = 'perfiles'; // nombre exacto de la hoja con datos detallados
const PROFILE_URL = `https://opensheet.elk.sh/${SHEET_ID}/${PROFILE_TAB}`;

const container = document.getElementById('profileContainer');

(function init() {
  const session = JSON.parse(localStorage.getItem('session') || 'null');
  if (!session) {
    location.href = 'login.html';
    return;
  }

  fetch(PROFILE_URL)
    .then(r => r.ok ? r.json() : Promise.reject('network'))
    .then(rows => {
      const data = rows.find(r => r.user === session.user);
      if (!data) throw new Error('No profile');
      renderProfile(data);
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = '<p class="text-center text-red-600">No se pudo cargar el perfil.</p>';
    });
})();

function renderProfile(d) {
  container.innerHTML = `
    <div class="bg-white p-8 rounded shadow max-w-lg mx-auto">
      <img src="${d.foto || 'https://via.placeholder.com/150'}" alt="Avatar" class="w-32 h-32 mx-auto rounded-full mb-4 object-cover">
      <h1 class="text-2xl font-bold text-center mb-2">${d.nombre}</h1>
      <p class="text-center text-gray-600 mb-4">${d.email || ''}</p>
      <p class="text-gray-800 whitespace-pre-line">${d.bio || 'Bio pendiente.'}</p>
    </div>
  `;
}

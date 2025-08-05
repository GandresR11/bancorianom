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
        console.log(user);
        window.location.href = 'dashboard.html';
        console.log(user);
      } else {
        errorElem.textContent = 'Usuario o clave incorrectos';
      }
    });
  }

  const userData = JSON.parse(localStorage.getItem('userData'));
  console.log(userData);
  if (userData && document.body.classList.contains('dashboard-page')) {
    console.log('Información lista del usuario: ',userData);
    document.getElementById('username').textContent = userData.username;
    const nombrereal = userData.username;
    console.log(nombrereal);
    document.getElementById('nombre').textContent = userData.nombre;
    document.getElementById('apellido').textContent = userData.apellido;
    document.getElementById('correo').textContent = userData.correo;
    document.getElementById('asignado').textContent = userData.asignado;
    document.getElementById('entregado').textContent = userData.entregado;
    document.getElementById('saldo').textContent = userData.saldo;

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

document.addEventListener('DOMContentLoaded', () => {
  const editarBtn = document.getElementById('editar-datos-btn');
  const modal = document.getElementById('modal-editar');
  const cerrarModalBtn = document.getElementById('cerrar-modal');
  const editarForm = document.getElementById('editar-form');

  const userData = JSON.parse(localStorage.getItem('userData'));

  if (editarBtn && modal && editarForm && userData) {
    // Mostrar el modal con datos actuales
    editarBtn.addEventListener('click', () => {
      modal.style.display = 'block';
      document.getElementById('edit-nombre').value = userData.nombre || '';
      document.getElementById('edit-apellido').value = userData.apellido || '';
      document.getElementById('edit-correo').value = userData.correo || '';
      document.getElementById('edit-ingresos').value = userData.ingresos || '';
      document.getElementById('edit-egresos').value = userData.egresos || '';
    });

    // Cerrar el modal
    cerrarModalBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // Guardar cambios
    editarForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const updatedUser = {
        ...userData,
        nombre: document.getElementById('edit-nombre').value,
        apellido: document.getElementById('edit-apellido').value,
        correo: document.getElementById('edit-correo').value,
        ingresos: document.getElementById('edit-ingresos').value,
        egresos: document.getElementById('edit-egresos').value
      };

      try {
        const response = await fetch('URL_DEL_ENDPOINT_MODIFICAR', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser)
        });

        const result = await response.json();

        if (result.success) {
          localStorage.setItem('userData', JSON.stringify(updatedUser));
          alert('Datos actualizados correctamente');
          window.location.href = 'dashboard.html';
        } else {
          alert('Error al actualizar los datos.');
        }
      } catch (err) {
        console.error('Error actualizando:', err);
        alert('Error en la conexión con el servidor.');
      }
    });
  }
});



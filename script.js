document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    const userFullName = document.getElementById('user-full-name');
    const userRole = document.getElementById('user-role'); // Asumiendo que puedes tener un rol
    const totalBalanceElement = document.getElementById('total-balance');
    const detailedBalanceList = document.getElementById('detailed-balance-list');
    const requestsList = document.getElementById('requests-list');
    const logoutBtn = document.getElementById('logout-btn');

    // ** IMPORTANTE: Reemplaza con la URL de tu Web App de Google Apps Script **
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwNDwVY2l8ZXjsuT76sB6dbdIIFgobLeULZofTpKtGckJDYa3w8_J1SMX705R0i6uM5FA/exec';

    let currentUser = null; // Almacenará los datos del usuario logueado

    // Función para mostrar/ocultar secciones con animación
    function showSection(sectionToShow, sectionToHide) {
        if (sectionToHide) {
            sectionToHide.classList.remove('active');
            sectionToHide.style.display = 'none';
        }
        sectionToShow.style.display = 'block';
        setTimeout(() => {
            sectionToShow.classList.add('active');
        }, 50); // Pequeño retraso para que la transición CSS funcione
    }

    // Función para cargar los datos del usuario en el dashboard
    function loadDashboard(userData) {
        userFullName.textContent = userData.nombrecompleto || 'Usuario Desconocido';
        userRole.textContent = userData.rol || 'Cliente'; // Asume que tienes un campo 'rol'

        // Simula datos de saldo y solicitudes (ajusta esto a la estructura de tu Google Sheet)
        totalBalanceElement.textContent = `$${(userData.saldototal || 0).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;

        detailedBalanceList.innerHTML = '';
        if (userData.saldodetallado) {
            // Asume saldo detallado es un string como "Cuenta A: 1000; Cuenta B: 500"
            userData.saldodetallado.split(';').forEach(item => {
                const parts = item.split(':');
                if (parts.length === 2) {
                    const li = document.createElement('li');
                    li.innerHTML = `<span>${parts[0].trim()}</span><strong>$${parseFloat(parts[1]).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</strong>`;
                    detailedBalanceList.appendChild(li);
                }
            });
        } else {
            detailedBalanceList.innerHTML = '<li>No hay detalles de saldo disponibles.</li>';
        }


        requestsList.innerHTML = '';
        if (userData.solicitudesrealizadas) {
            // Asume solicitudes es un string como "Prestamo:Pendiente; Retiro:Completado"
            userData.solicitudesrealizadas.split(';').forEach(item => {
                const parts = item.split(':');
                if (parts.length === 2) {
                    const li = document.createElement('li');
                    li.innerHTML = `<span>${parts[0].trim()}</span><strong>${parts[1].trim()}</strong>`;
                    requestsList.appendChild(li);
                }
            });
        } else {
            requestsList.innerHTML = '<li>No hay solicitudes realizadas.</li>';
        }


        showSection(dashboardSection, loginSection);
    }

    // Manejar el envío del formulario de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.textContent = '';
        loginError.style.opacity = '0';

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            loginError.textContent = 'Por favor, ingresa tu usuario y contraseña.';
            loginError.style.opacity = '1';
            return;
        }

        try {
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'cors', // Necesario para peticiones a Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                currentUser = data.user;
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser)); // Guardar en sessionStorage
                loadDashboard(currentUser);
            } else {
                loginError.textContent = data.message || 'Error de autenticación.';
                loginError.style.opacity = '1';
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            loginError.textContent = 'Error de conexión. Intenta de nuevo más tarde.';
            loginError.style.opacity = '1';
        }
    });

    // Manejar el cierre de sesión
    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        sessionStorage.removeItem('currentUser'); // Eliminar de sessionStorage
        usernameInput.value = '';
        passwordInput.value = '';
        loginError.textContent = '';
        loginError.style.opacity = '0';
        showSection(loginSection, dashboardSection);
    });

    // Verificar si ya hay una sesión activa al cargar la página
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        loadDashboard(currentUser);
    } else {
        showSection(loginSection); // Mostrar el login si no hay sesión
    }
});

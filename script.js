const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const dashboard = document.getElementById("dashboard");
const loginContainer = document.getElementById("login-container");
const logoutBtn = document.getElementById("logout-btn");

// Cambia por tu URL de Apps Script
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwNDwVY2l8ZXjsuT76sB6dbdIIFgobLeULZofTpKtGckJDYa3w8_J1SMX705R0i6uM5FA/exec";

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";

  const submitBtn = loginForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.textContent = "Ingresando...";

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const data = await response.json();

    if (data.success) {
      loginContainer.style.display = "none";
      dashboard.style.display = "block";
      document.getElementById("user-name").textContent = data.user.nombrecompleto;
      document.getElementById("user-role").textContent = data.user.rol;
      document.getElementById("user-balance").textContent = data.user.saldototal;
      document.getElementById("user-detail").textContent = data.user.saldodetallado;
      document.getElementById("user-requests").textContent = data.user.solicitudesrealizadas;
    } else {
      loginError.textContent = data.message || "Usuario o contraseña incorrectos.";
    }
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    loginError.textContent = "Error al conectar con el servidor.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Iniciar Sesión";
  }
});

logoutBtn.addEventListener("click", () => {
  dashboard.style.display = "none";
  loginContainer.style.display = "block";
  loginForm.reset();
});


const TOKEN_KEY = "authToken";

function showMessage(element, message, type = "error") {
  if (!element) return;
  element.textContent = message;
  element.className = `message ${type}`;
}

async function apiRequest(url, options = {}) {
  const token = sessionStorage.getItem(TOKEN_KEY);

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

// Registration
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = registerForm.querySelector('button[type="submit"]');
    const message = document.getElementById("registerMessage");

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    button.disabled = true;
    showMessage(message, "Creating your account...", "success");

    try {
      await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password })
      });

      showMessage(
        message,
        "Registration successful! Redirecting to login...",
        "success"
      );

      registerForm.reset();

      setTimeout(() => {
        window.location.href = "/login.html";
      }, 1000);
    } catch (error) {
      showMessage(message, error.message);
    } finally {
      button.disabled = false;
    }
  });
}

// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = loginForm.querySelector('button[type="submit"]');
    const message = document.getElementById("loginMessage");

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    button.disabled = true;
    showMessage(message, "Logging in...", "success");

    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      if (!data.token) {
        throw new Error("Login succeeded but no token was returned.");
      }

      sessionStorage.setItem(TOKEN_KEY, data.token);
      window.location.href = "/dashboard.html";
    } catch (error) {
      showMessage(message, error.message);
    } finally {
      button.disabled = false;
    }
  });
}

// Dashboard: verify the JWT with the protected endpoint
const welcomeMessage = document.getElementById("welcomeMessage");

if (welcomeMessage) {
  async function loadDashboard() {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const dashboardMessage = document.getElementById("dashboardMessage");

    if (!token) {
      window.location.replace("/login.html");
      return;
    }

    try {
      const data = await apiRequest("/api/auth/me");

      welcomeMessage.textContent = `Welcome, ${data.user.username}!`;
      dashboardMessage.textContent = `Email: ${data.user.email}`;
    } catch (error) {
      sessionStorage.removeItem(TOKEN_KEY);
      dashboardMessage.textContent = "Your session has expired. Please log in again.";
      window.location.replace("/login.html");
    }
  }

  loadDashboard();
}

// Logout
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    const dashboardMessage = document.getElementById("dashboardMessage");
    logoutButton.disabled = true;

    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch (error) {
      // Clear the local token even if the logout request fails.
    } finally {
      sessionStorage.removeItem(TOKEN_KEY);
      window.location.replace("/login.html");
    }
  });
}

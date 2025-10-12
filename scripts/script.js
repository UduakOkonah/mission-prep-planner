// --- Helper ---
function $id(id) {
  return document.getElementById(id);
}

// --- AUTH PAGE (login + signup) ---
function initAuthPage() {
  const page = document.body.getAttribute("data-page");
  if (page !== "auth") return;

  const loginTab = $id("login-tab");
  const signupTab = $id("signup-tab");
  const loginForm = $id("login-form");
  const signupForm = $id("signup-form");

  // Switch between tabs
  loginTab?.addEventListener("click", () => {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
  });

  signupTab?.addEventListener("click", () => {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
  });

  // --- SIGNUP ---
  signupForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $id("signup-name").value.trim();
    const email = $id("signup-email").value.trim();
    const password = $id("signup-password").value.trim();

    if (!name || !email || !password) return alert("All fields required.");

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((u) => u.email === email)) return alert("Email already exists!");

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created successfully. Please log in!");
    signupForm.reset();
    loginTab.click();
  });

  // --- LOGIN ---
  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $id("login-email").value.trim();
    const password = $id("login-password").value.trim();

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) return alert("Invalid email or password!");

    localStorage.setItem("loggedInUser", JSON.stringify(user));
    window.location.href = "dashboard.html";
  });
}

// --- LOGOUT ---
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "mission-auth.html";
}

// --- PAGE PROTECTION ---
function initAuthProtection() {
  const page = document.body.getAttribute("data-page");
  const protectedPages = ["dashboard", "goals", "goal-detail", "resources"];
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");

  if (protectedPages.includes(page) && !user) {
    window.location.href = "mission-auth.html";
  }
}

// --- HOME PAGE LOGIC ---
function initHomePage() {
  const page = document.body.getAttribute("data-page");
  if (page !== "home") return;

  const startBtn = $id("start-btn");
  startBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    window.location.href = user ? "dashboard.html" : "mission-auth.html";
  });
}

// --- DASHBOARD LOGIC ---
function initDashboardPage() {
  const page = document.body.getAttribute("data-page");
  if (page !== "dashboard") return;

  const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  const welcome = document.getElementById("welcome-user");
  const logoutBtn = document.getElementById("logout-btn");

  // If no user, redirect
  if (!user) {
    window.location.href = "mission-auth.html";
    return;
  }

  // Display name
  if (welcome) {
    welcome.textContent = `Welcome, ${user.name || "Missionary"}!`;
  }

  // Logout
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "mission-auth.html";
  });
}


// --- MAIN INITIALIZER ---
window.addEventListener("DOMContentLoaded", () => {
  console.log("Auth + Protection system initialized...");
  initAuthPage();
  initAuthProtection();
  initHomePage();
  initDashboardPage();
});

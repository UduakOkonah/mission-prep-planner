// ====== Users ======
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Get the currently logged-in user email
function getCurrentUser() {
  return localStorage.getItem("currentUser") || null;
}

// Set the currently logged-in user email
function setCurrentUser(email) {
  localStorage.setItem("currentUser", email);
}

// Get the logged-in user object
function getLoggedInUser() {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;
  const users = getUsers();
  return users.find(u => u.email === currentUser) || null;
}

// ====== Goals ======
function getGoals() {
  const user = getLoggedInUser();
  return user?.goals || [];
}

function saveGoals(goals) {
  const users = getUsers();
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const userIndex = users.findIndex(u => u.email === currentUser);
  if (userIndex !== -1) {
    users[userIndex].goals = goals;
    saveUsers(users);
  }
}

// ====== Tasks ======
function getTasks() {
  const user = getLoggedInUser();
  return user?.tasks || [];
}

function saveTasks(tasks) {
  const users = getUsers();
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const userIndex = users.findIndex(u => u.email === currentUser);
  if (userIndex !== -1) {
    users[userIndex].tasks = tasks;
    saveUsers(users);
  }
}

// ====== Resources ======
function getResources() {
  const user = getLoggedInUser();
  return user?.resources || [];
}

function saveResources(resources) {
  const users = getUsers();
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const userIndex = users.findIndex(u => u.email === currentUser);
  if (userIndex !== -1) {
    users[userIndex].resources = resources;
    saveUsers(users);
  }
}

// ====== Notifications ======
function getNotificationsSetting() {
  const user = getLoggedInUser();
  return user?.notificationsEnabled ?? true; // default on
}

function setNotificationsSetting(enabled) {
  const users = getUsers();
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const userIndex = users.findIndex(u => u.email === currentUser);
  if (userIndex !== -1) {
    users[userIndex].notificationsEnabled = enabled;
    saveUsers(users);
  }
}

// ====== Helper: Generate Notifications ======
function generateNotifications() {
  if (!getNotificationsSetting()) return []; // notifications disabled

  const user = getLoggedInUser();
  if (!user) return [];

  const messages = ["📝 Don't forget to check your tasks today!"];

  const now = new Date();
  const goals = getGoals();
  goals.forEach(goal => {
    if (goal.deadline && new Date(goal.deadline) < now && goal.progress < 100) {
      messages.push(`⚠️ Goal "${goal.title}" is overdue!`);
    }
  });

  return messages;
}

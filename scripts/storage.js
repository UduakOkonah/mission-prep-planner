// storage.js
function getGoals() {
  return JSON.parse(localStorage.getItem("goals")) || [];
}
function saveGoals(goals) {
  localStorage.setItem("goals", JSON.stringify(goals));
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}
function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getResources() {
  return JSON.parse(localStorage.getItem("resources")) || [];
}
function saveResources(resources) {
  localStorage.setItem("resources", JSON.stringify(resources));
}

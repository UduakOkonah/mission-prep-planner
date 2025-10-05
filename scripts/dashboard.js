// ==========================
// Helper Functions
// ==========================
function loadGoals() {
  return JSON.parse(localStorage.getItem("goals")) || [];
}

function saveGoals(goals) {
  localStorage.setItem("goals", JSON.stringify(goals));
}

// ==========================
// Daily Checklist (from goals' checklists)
// ==========================
function renderTasks() {
  const tasksList = document.getElementById("tasks-list");
  const goals = loadGoals();

  tasksList.innerHTML = "";

  if (goals.length === 0) {
    tasksList.innerHTML = `<p class="empty-text">No goals or checklist items yet.</p>`;
    return;
  }

  goals.forEach(goal => {
    if (goal.checklist && goal.checklist.length > 0) {
      const goalSection = document.createElement("div");
      goalSection.classList.add("goal-section");

      const goalTitle = document.createElement("h4");
      goalTitle.textContent = goal.title || goal.name || "Untitled Goal";
      goalSection.appendChild(goalTitle);

      const ul = document.createElement("ul");

      goal.checklist.forEach((item, index) => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.done || false;
        checkbox.onchange = () => toggleChecklistItem(goal.id, index);

        const label = document.createElement("span");
        label.textContent = item.text || "Untitled Task";

        li.appendChild(checkbox);
        li.appendChild(label);
        ul.appendChild(li);
      });

      goalSection.appendChild(ul);
      tasksList.appendChild(goalSection);
    }
  });
}

// Toggle checklist item
function toggleChecklistItem(goalId, itemIndex) {
  const goals = loadGoals();
  const goal = goals.find(g => g.id === goalId);
  if (!goal || !goal.checklist) return;

  goal.checklist[itemIndex].done = !goal.checklist[itemIndex].done;

  // update progress automatically
  const completedCount = goal.checklist.filter(i => i.done).length;
  goal.progress = Math.round((completedCount / goal.checklist.length) * 100);

  saveGoals(goals);
  renderTasks();
  renderProgress();
}

// ==========================
// Progress Tracker
// ==========================
function renderProgress() {
  const container = document.getElementById("progress-container");
  const goals = loadGoals();

  container.innerHTML = "";

  if (goals.length === 0) {
    container.innerHTML = `<p class="empty-text">No goals yet.</p>`;
    return;
  }

  goals.forEach(goal => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("progress-wrapper");

    const label = document.createElement("span");
    label.textContent = `${goal.title || goal.name || "Untitled"} - ${goal.progress || 0}%`;

    const barContainer = document.createElement("div");
    barContainer.classList.add("progress-container-bar");

    const bar = document.createElement("div");
    bar.classList.add("progress-filled");
    bar.style.width = (goal.progress || 0) + "%";

    barContainer.appendChild(bar);
    wrapper.appendChild(label);
    wrapper.appendChild(barContainer);
    container.appendChild(wrapper);
  });
}

// ==========================
// Daily Quote
// ==========================
function loadQuote() {
  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");

  const quote = {
    text: "Faith is taking the first step even when you don’t see the whole staircase.",
    author: "Martin Luther King Jr."
  };

  quoteText.textContent = quote.text;
  quoteAuthor.textContent = "- " + quote.author;
}

// ==========================
// Weekly Analytics
// ==========================
function renderWeeklyAnalytics() {
  const container = document.getElementById("analytics-container");
  const goals = loadGoals();

  container.innerHTML = "";

  if (goals.length === 0) {
    container.innerHTML = `<p class="empty-text">No analytics available.</p>`;
    return;
  }

  const completedGoals = goals.filter(g => (g.progress || 0) === 100).length;
  const averageProgress =
    goals.length > 0
      ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length)
      : 0;

  const analytics = [
    { name: "Completed Goals", value: completedGoals, total: goals.length },
    { name: "Average Progress", value: averageProgress, total: 100 }
  ];

  analytics.forEach(item => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("analytics-item");

    const label = document.createElement("span");
    label.classList.add("analytics-label");
    label.textContent = `${item.name}: ${item.value}`;

    const barContainer = document.createElement("div");
    barContainer.classList.add("analytics-bar-container");

    const barFill = document.createElement("div");
    barFill.classList.add("analytics-bar-fill");
    const percent = Math.round((item.value / item.total) * 100);
    barFill.style.width = percent + "%";

    barContainer.appendChild(barFill);
    wrapper.appendChild(label);
    wrapper.appendChild(barContainer);
    container.appendChild(wrapper);
  });
}

// ==========================
// Initialize Dashboard
// ==========================
function initDashboard() {
  renderTasks();
  renderProgress();
  loadQuote();
  renderWeeklyAnalytics();
}

window.addEventListener("DOMContentLoaded", initDashboard);

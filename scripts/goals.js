// goals.js
document.addEventListener("DOMContentLoaded", () => {
  const goalForm = document.getElementById("goalForm");
  const goalList = document.getElementById("goalList");

  // Migrate old goal shape if needed
  migrateOldGoals();

  // Render current goals (empty if none)
  renderGoals();

  // Handle form submission: add new goal
  goalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("goalTitle").value.trim();
    const category = document.getElementById("goalCategory").value.trim();
    const description = document.getElementById("goalDescription").value.trim();

    if (!title) {
      alert("Please enter a goal title.");
      return;
    }

    const newGoal = {
      id: Date.now().toString(),
      title,
      category: category || "General",
      description,
      deadline: "",
      progress: 0,
      checklist: [],
      notes: "",
      createdAt: new Date().toISOString()
    };

    const goals = getGoals();
    goals.push(newGoal);
    saveGoals(goals);

    goalForm.reset();
    renderGoals();
  });

    // Clear all goals
  const clearBtn = document.getElementById("clearGoalsBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const confirmClear = confirm("Are you sure you want to delete all goals?");
      if (confirmClear) {
        localStorage.removeItem("goals");
        renderGoals();
      }
    });
  }


  // Render the user's goals
  function renderGoals() {
    const goals = getGoals();
    goalList.innerHTML = "";

    if (!goals || goals.length === 0) {
      goalList.innerHTML = "<p>No goals yet. Add one above!</p>";
      return;
    }

    goals.forEach((goal) => {
      const title = goal.title ?? "Untitled Goal";
      const description = goal.description ?? "";
      const category = goal.category ?? "General";
      const progress = typeof goal.progress === "number" ? goal.progress : (Number(goal.progress) || 0);

      const card = document.createElement("div");
      card.classList.add("goal-card");
      card.innerHTML = `
        <div class="goal-header">
          <h3>${escapeHtml(title)}</h3>
          <span class="goal-category">${escapeHtml(category)}</span>
        </div>
        <p>${escapeHtml(description)}</p>
        <div class="goal-progress">
          <progress value="${progress}" max="100"></progress>
          <span>${progress}%</span>
        </div>
      `;

      card.addEventListener("click", () => {
        window.location.href = `goal-detail.html?id=${encodeURIComponent(goal.id)}`;
      });

      goalList.appendChild(card);
    });
  }

  // Migrate old goal format (if any)
  function migrateOldGoals() {
    const goals = getGoals();
    let changed = false;

    const migrated = goals.map((g) => {
      if (g && (g.name !== undefined || g.details !== undefined)) {
        const copy = { ...g };
        copy.title = copy.title ?? copy.name ?? "Untitled Goal";
        copy.description = copy.description ?? copy.details ?? "";
        copy.category = copy.category ?? "General";
        copy.progress = typeof copy.progress === "number" ? copy.progress : (Number(copy.progress) || 0);
        delete copy.name;
        delete copy.details;
        changed = true;
        return copy;
      }
      return g;
    });

    if (changed) saveGoals(migrated);
  }

  // Helpers
  function getGoals() {
    return JSON.parse(localStorage.getItem("goals") || "[]");
  }

  function saveGoals(goals) {
    localStorage.setItem("goals", JSON.stringify(goals));
  }

  function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});

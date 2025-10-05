// goals.js
document.addEventListener("DOMContentLoaded", () => {
  const goalForm = document.getElementById("goalForm");
  const goalList = document.getElementById("goalList");

  // Default seed (only used if storage is empty)
  const DEFAULT_GOALS = [
    {
      id: "172812391",
      title: "Learn Preach My Gospel",
      category: "Spiritual",
      description: "Study one lesson daily",
      deadline: "2025-12-20",
      progress: 60,
      checklist: [
        { text: "Finish Lesson 1", done: true },
        { text: "Lesson 2 tomorrow", done: false }
      ],
      notes: "Need to focus more on section 3"
    },
    {
      id: "1",
      title: "Learn Spanish Basics",
      category: "Language",
      description: "Practice daily vocabulary and grammar.",
      deadline: "2025-12-01",
      progress: 20,
      checklist: [
        { text: "Learn 20 basic words", done: true },
        { text: "Practice greetings", done: false },
        { text: "Review verbs", done: false }
      ],
      notes: "Focus more on pronunciation and listening."
    },
    {
      id: "2",
      title: "Daily Scripture Study",
      category: "Spiritual",
      description: "Read 1 chapter each day and take notes.",
      deadline: "2025-12-31",
      progress: 40,
      checklist: [
        { text: "Genesis 1-5", done: true },
        { text: "Exodus 1-3", done: true },
        { text: "Leviticus 1", done: false }
      ],
      notes: "Try morning sessions for better focus."
    },
    {
      id: "3",
      title: "Exercise Routine",
      category: "Health",
      description: "Follow daily 30-minute routine for fitness.",
      deadline: "2025-12-31",
      progress: 50,
      checklist: [
        { text: "Morning jog (15 mins)", done: true },
        { text: "Stretching exercises", done: true },
        { text: "Push-ups and sit-ups", done: false }
      ],
      notes: "Maintain consistency—avoid skipping weekends."
    },
    {
      id: "4",
      title: "Language Learning (French)",
      category: "Language",
      description: "Focus on speaking and listening practice.",
      deadline: "2026-01-15",
      progress: 10,
      checklist: [
        { text: "Learn basic greetings", done: true },
        { text: "Practice pronunciation", done: false },
        { text: "Watch a short French video", done: false }
      ],
      notes: "Listen to French podcasts for faster learning."
    }
  ];

  // 1) migrate old shaped goals (name/details -> title/description)
  migrateOldGoals();

  // 2) seed defaults if still empty
  if (getGoals().length === 0) {
    saveGoals(DEFAULT_GOALS);
  }

  renderGoals();

  // Form submit: add a new goal
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

  // Render goals safely using new schema (title/description)
  function renderGoals() {
    const goals = getGoals();
    goalList.innerHTML = "";

    if (!goals || goals.length === 0) {
      goalList.innerHTML = "<p>No goals yet. Add one above!</p>";
      return;
    }

    goals.forEach((goal) => {
      const title = goal.title ?? goal.name ?? "Untitled Goal";
      const description = goal.description ?? goal.details ?? "";
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
        // navigate with ID as string
        window.location.href = `goal-detail.html?id=${encodeURIComponent(String(goal.id))}`;
      });

      goalList.appendChild(card);
    });
  }

  // Migrate old fields (name/details) -> (title/description)
  function migrateOldGoals() {
    const goals = getGoals();
    let changed = false;
    const migrated = goals.map(g => {
      // if object has old keys, migrate
      if (g && (g.name !== undefined || g.details !== undefined)) {
        const copy = Object.assign({}, g);
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

  // small helper to avoid HTML injection when rendering content
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

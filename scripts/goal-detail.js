document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const goalId = params.get("id"); // keep as string for safety

  const goals = getGoals();
  const goal = goals.find(g => String(g.id) === String(goalId));

  // Handle missing goal
  if (!goal) {
    document.querySelector(".content").innerHTML = `
      <p style="padding: 2rem;">Goal not found. Go back to <a href="goals.html">Goals</a>.</p>
    `;
    return;
  }

  // Elements
  const titleEl = document.getElementById("goalTitle");
  const descEl = document.getElementById("goalDescription");
  const checklistEl = document.getElementById("checklist");
  const newChecklistItem = document.getElementById("newChecklistItem");
  const addChecklistBtn = document.getElementById("addChecklistBtn");
  const progressInput = document.getElementById("progressInput");
  const updateProgressBtn = document.getElementById("updateProgressBtn");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const notesInput = document.getElementById("notesInput");
  const saveNotesBtn = document.getElementById("saveNotesBtn");

  // Initialize content
  titleEl.textContent = goal.title || goal.name || "Untitled Goal";
  descEl.textContent = goal.description || goal.details || "No description added.";
  progressInput.value = goal.progress || 0;
  updateProgressBar(goal.progress || 0);
  notesInput.value = goal.notes || "";

  renderChecklist();

  // --- Checklist ---
  addChecklistBtn.addEventListener("click", () => {
    const text = newChecklistItem.value.trim();
    if (!text) return alert("Please enter a checklist item.");

    goal.checklist = goal.checklist || [];
    goal.checklist.push({ text, done: false });
    saveGoals(goals);

    newChecklistItem.value = "";
    renderChecklist();
  });

  function renderChecklist() {
    checklistEl.innerHTML = "";
    (goal.checklist || []).forEach((item, index) => {
      const li = document.createElement("li");
      li.classList.add("checklist-item");
      li.innerHTML = `
        <label>
          <input type="checkbox" ${item.done ? "checked" : ""}>
          <span>${item.text}</span>
        </label>
        <button class="delete-btn">✕</button>
      `;

      const checkbox = li.querySelector("input");
      checkbox.addEventListener("change", () => {
        goal.checklist[index].done = checkbox.checked;
        saveGoals(goals);
      });

      li.querySelector(".delete-btn").addEventListener("click", () => {
        goal.checklist.splice(index, 1);
        saveGoals(goals);
        renderChecklist();
      });

      checklistEl.appendChild(li);
    });
  }

  // --- Progress ---
  updateProgressBtn.addEventListener("click", () => {
    let value = parseInt(progressInput.value);
    if (isNaN(value) || value < 0 || value > 100) {
      alert("Enter a valid number between 0 and 100.");
      return;
    }

    goal.progress = value;
    saveGoals(goals);
    updateProgressBar(value);
  });

  function updateProgressBar(value) {
    progressFill.style.width = value + "%";
    progressText.textContent = `Progress: ${value}%`;
  }

  // --- Notes ---
  saveNotesBtn.addEventListener("click", () => {
    const text = notesInput.value.trim();
    goal.notes = text;
    saveGoals(goals);

    saveNotesBtn.textContent = "Saved!";
    setTimeout(() => (saveNotesBtn.textContent = "Save Notes"), 1200);
  });
});

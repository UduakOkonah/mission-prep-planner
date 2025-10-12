// scripts/goal-detail.js
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const goalId = params.get("id"); // Keep as string for safety

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

  // --- Make title and description editable ---
  titleEl.contentEditable = true;
  descEl.contentEditable = true;

  titleEl.addEventListener("input", () => {
    goal.title = titleEl.textContent.trim();
    saveGoals(goals);
  });

  descEl.addEventListener("input", () => {
    goal.description = descEl.textContent.trim();
    saveGoals(goals);
  });

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

  // --- Resources ---
const resourceList = document.getElementById("resourceList");
const newResourceLink = document.getElementById("newResourceLink");
const addResourceBtn = document.getElementById("addResourceBtn");

// Render existing resources
renderResources();

addResourceBtn.addEventListener("click", () => {
  const link = newResourceLink.value.trim();
  if (!link) return alert("Please enter a resource link.");

  goal.resources = goal.resources || [];
  goal.resources.push(link);
  saveGoals(goals);

  newResourceLink.value = "";
  renderResources();
});

function renderResources() {
  resourceList.innerHTML = "";
  (goal.resources || []).forEach((res, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="${res}" target="_blank">${res}</a>
      <button class="delete-btn">✕</button>
    `;

    li.querySelector(".delete-btn").addEventListener("click", () => {
      goal.resources.splice(index, 1);
      saveGoals(goals);
      renderResources();
    });

    resourceList.appendChild(li);
  });
}

// --- Deadline ---
const deadlineInput = document.getElementById("deadlineInput");
const saveDeadlineBtn = document.getElementById("saveDeadlineBtn");
const deadlineText = document.getElementById("deadlineText");

if (goal.deadline) {
  deadlineInput.value = goal.deadline;
  updateDeadlineDisplay();
}

saveDeadlineBtn.addEventListener("click", () => {
  goal.deadline = deadlineInput.value;
  saveGoals(goals);
  updateDeadlineDisplay();
});

function updateDeadlineDisplay() {
  if (!goal.deadline) {
    deadlineText.textContent = "No deadline set.";
    deadlineText.style.color = "#666";
    return;
  }

  const today = new Date();
  const deadline = new Date(goal.deadline);
  const overdue = deadline < today;

  if (overdue) {
    deadlineText.innerHTML = `⚠️ Deadline: ${deadline.toDateString()} (Overdue)`;
    deadlineText.style.color = "white";
    deadlineText.style.background = "red";
    deadlineText.style.padding = "5px 10px";
    deadlineText.style.borderRadius = "6px";
  } else {
    deadlineText.textContent = `Deadline: ${deadline.toDateString()}`;
    deadlineText.style.color = "green";
    deadlineText.style.background = "transparent";
  }
}



  // --- Delete Goal Button ---
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete Goal";
  deleteBtn.classList.add("danger-btn");
  deleteBtn.style.marginTop = "1.5rem";
  deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this goal?")) {
      const updatedGoals = goals.filter(g => String(g.id) !== String(goalId));
      saveGoals(updatedGoals);
      window.location.href = "goals.html";
    }
  });

  document.querySelector(".content").appendChild(deleteBtn);
});

// scripts/resources.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resource-form");
  const nameInput = document.getElementById("resource-name");
  const linkInput = document.getElementById("resource-link");
  const goalInput = document.getElementById("resource-goal");
  const listContainer = document.getElementById("resources-list");

  renderResources();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const link = linkInput.value.trim();
    const goalId = parseInt(goalInput.value.trim());

    if (!name || !link || isNaN(goalId)) {
      alert("Please fill in all fields correctly.");
      return;
    }

    const resources = getResources();
    const newResource = {
      id: Date.now(),
      name,
      link,
      goalId,
      dateAdded: new Date().toLocaleDateString()
    };

    resources.push(newResource);
    saveResources(resources);
    renderResources();

    form.reset();
  });

  function renderResources() {
    const resources = getResources();
    listContainer.innerHTML = "";

    if (resources.length === 0) {
      listContainer.innerHTML = "<p>No resources added yet.</p>";
      return;
    }

    resources.forEach((res) => {
      const div = document.createElement("div");
      div.classList.add("resource-card");
      div.innerHTML = `
        <h3>${res.name}</h3>
        <p><a href="${res.link}" target="_blank">${res.link}</a></p>
        <p><strong>Goal ID:</strong> ${res.goalId}</p>
        <p><small>Added on: ${res.dateAdded}</small></p>
        <button class="delete-btn" data-id="${res.id}">Delete</button>
      `;

      div.querySelector(".delete-btn").addEventListener("click", () => {
        const updated = getResources().filter((r) => r.id !== res.id);
        saveResources(updated);
        renderResources();
      });

      listContainer.appendChild(div);
    });
  }
});

function initResources() {
  renderResources();

  const form = document.getElementById("resource-form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    addResource();
  });
}

function renderResources() {
  const container = document.getElementById("resources-list");
  const resources = getResources();
  container.innerHTML = "";

  resources.forEach(res => {
    const div = document.createElement("div");
    div.classList.add("resource-card");
    div.innerHTML = `
      <h3>${res.name}</h3>
      <p>Goal ID: ${res.goalId}</p>
      <a href="${res.link}" target="_blank">Open Resource</a>
      <button onclick="deleteResource(${res.id})">Delete</button>
    `;
    container.appendChild(div);
  });
}

function addResource() {
  const name = document.getElementById("resource-name").value;
  const link = document.getElementById("resource-link").value;
  const goalId = parseInt(document.getElementById("resource-goal").value);

  if (!name || !link || !goalId) return alert("Fill all fields");

  const resources = getResources();
  const newRes = { id: Date.now(), name, link, goalId };
  resources.push(newRes);
  saveResources(resources);
  renderResources();
  document.getElementById("resource-form").reset();
}

function deleteResource(id) {
  let resources = getResources();
  resources = resources.filter(r => r.id !== id);
  saveResources(resources);
  renderResources();
}

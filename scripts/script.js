document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menu-toggle");

  menuToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    document.body.classList.toggle("sidebar-open", isOpen);

    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  // Close sidebar when clicking outside
  document.body.addEventListener("click", (e) => {
    if (
      sidebar.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      sidebar.classList.remove("open");
      document.body.classList.remove("sidebar-open");
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });

  // Close when clicking on any sidebar link
  sidebar.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open");
      document.body.classList.remove("sidebar-open");
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
});



// Initialize app
function initApp() {
  // Load sample data if not in localStorage
  if (!localStorage.getItem("goals")) {
    fetch("data/goals.json")
      .then(res => res.json())
      .then(data => localStorage.setItem("goals", JSON.stringify(data)));
  }

  if (!localStorage.getItem("tasks")) {
    fetch("data/tasks.json")
      .then(res => res.json())
      .then(data => localStorage.setItem("tasks", JSON.stringify(data)));
  }

  if (!localStorage.getItem("resources")) {
    fetch("data/resources.json")
      .then(res => res.json())
      .then(data => localStorage.setItem("resources", JSON.stringify(data)));
  }
}

// Simple routing based on page
function initRouting() {
  const page = document.body.getAttribute("data-page");
  if (page === "dashboard") {
    initDashboard();
  } else if (page === "goals") {
    initGoals();
  } else if (page === "goal-detail") {
    initGoalDetail();
  } else if (page === "resources") {
    initResources();
  }
}

// Menu toggle for mobile
function initMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu');

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      menu.classList.toggle('show'); // match your CSS
    });
  }
}


// Initialize everything on DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  initApp();
  initRouting();
  initMenu(); // Add menu initialization
});

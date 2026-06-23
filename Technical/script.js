const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "Light" : "Dark";
});

const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.18 }
);

reveals.forEach((element) => revealObserver.observe(element));

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const projectType = document.getElementById("projectType").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !projectType || !message) {
    showFormMessage("Please fill all fields before sending.", "error");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    showFormMessage("Please enter a valid email address.", "error");
    return;
  }

  showFormMessage("Thank you! Your project request has been received.", "success");
  contactForm.reset();
});

function showFormMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = `form-message ${type}`;
}

const nodes = Array.from({ length: 28 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 0.7,
  vy: (Math.random() - 0.5) * 0.7,
  r: Math.random() * 2.5 + 2
}));

function drawNetwork() {
  const isDark = document.body.classList.contains("dark");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = isDark ? "rgba(34, 211, 238, 0.95)" : "rgba(0, 143, 156, 0.95)";
  nodes.forEach((node) => {
    node.x += node.vx;
    node.y += node.vy;

    if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
    if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fill();
  });

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 105) {
        const opacity = 1 - distance / 105;
        ctx.strokeStyle = isDark
          ? `rgba(34, 211, 238, ${opacity * 0.35})`
          : `rgba(0, 143, 156, ${opacity * 0.32})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  drawServerRack(isDark);
  requestAnimationFrame(drawNetwork);
}

function drawServerRack(isDark) {
  const rackX = 170;
  const rackY = 105;
  const rackW = 220;
  const rackH = 150;

  ctx.fillStyle = isDark ? "rgba(15, 23, 42, 0.72)" : "rgba(255, 255, 255, 0.72)";
  ctx.strokeStyle = isDark ? "rgba(148, 163, 184, 0.3)" : "rgba(17, 24, 39, 0.18)";
  ctx.lineWidth = 2;
  roundRect(rackX, rackY, rackW, rackH, 12);
  ctx.fill();
  ctx.stroke();

  for (let i = 0; i < 4; i++) {
    const y = rackY + 18 + i * 31;
    ctx.fillStyle = isDark ? "rgba(30, 41, 59, 0.9)" : "rgba(241, 245, 249, 0.92)";
    roundRect(rackX + 18, y, rackW - 36, 20, 5);
    ctx.fill();

    ctx.fillStyle = i % 2 === 0 ? "#22c55e" : "#f59e0b";
    ctx.beginPath();
    ctx.arc(rackX + rackW - 36, y + 10, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

drawNetwork();
// Nav show/hide on scroll
const nav = document.getElementById("topNav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    nav.classList.remove("hidden");
    nav.classList.add("visible");
  } else {
    nav.classList.add("hidden");
    nav.classList.remove("visible");
  }
}, { passive: true });

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Stacked notifications
const DEALS = [
  { company: "Análisis sistémico", time: "Evaluación completa del comportamiento del equipo." },
  { company: "Intervención precisa", time: "Acciones puntuales con impacto directo en el rendimiento." },
  { company: "Evolución tecnológica", time: "Adaptación progresiva sin reemplazos innecesarios." },
  { company: "Optimización operativa", time: "Mejora del desempeño enfocada en uso real y continuidad." },
  { company: "Integración eficiente", time: "Compatibilidad entre sistemas nuevos y existentes sin fricciones." },
];

const stack = document.getElementById("notifStack");
let queue = [0, 1, 2];
let nextIdx = 3;

function createCard(idx) {
  const d = DEALS[idx];
  const el = document.createElement("div");
  el.className = "notif-card";
  el.dataset.idx = idx;

  el.innerHTML = `
    <div class="notif-card-inner">
      <div class="notif-bar"></div>
      <div class="notif-text">
        <p class="notif-sub">${d.time}</p>
        <p class="notif-main">${d.company}</p>
      </div>
    </div>
  `;

  return el;
}

function render(animated) {
  stack.innerHTML = "";
  const positions = [
    { y: 0, scale: 0.88, opacity: 1, z: 1 },
    { y: 14, scale: 0.94, opacity: 1, z: 2 },
    { y: 28, scale: 1, opacity: 1, z: 3 },
  ];

  queue.forEach((idx, i) => {
    const card = createCard(idx);
    const p = positions[i];

    card.style.zIndex = p.z;
    card.style.opacity = p.opacity;
    card.style.transform = `translateY(-${p.y}px) scale(${p.scale})`;

    if (animated) {
      card.style.transition = "transform 1.68s cubic-bezier(0.22,1,0.36,1), opacity 1.68s cubic-bezier(0.22,1,0.36,1)";
    }

    stack.appendChild(card);
  });
}

render(false);

setInterval(() => {
  const incoming = nextIdx % DEALS.length;
  nextIdx++;

  // Add incoming at bottom
  const card = createCard(incoming);
  card.style.zIndex = 0;
  card.style.opacity = "0";
  card.style.transform = "translateY(0px) scale(0.88)";
  stack.appendChild(card);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Animate all cards up
      const cards = stack.querySelectorAll(".notif-card");
      cards.forEach(c => {
        c.style.transition = "transform 1.68s cubic-bezier(0.22,1,0.36,1), opacity 1.68s cubic-bezier(0.22,1,0.36,1), filter 1.68s cubic-bezier(0.22,1,0.36,1)";
      });

      // incoming -> pos 0
      card.style.opacity = "1";
      card.style.transform = "translateY(0px) scale(0.88)";

      // current queue shifts up
      const qCards = Array.from(cards).filter(c => parseInt(c.dataset.idx) !== incoming);

      if (qCards[0]) {
        qCards[0].style.transform = "translateY(-14px) scale(0.94)";
        qCards[0].style.zIndex = 2;
      }

      if (qCards[1]) {
        qCards[1].style.transform = "translateY(-28px) scale(1)";
        qCards[1].style.zIndex = 3;
      }

      if (qCards[2]) {
        qCards[2].style.opacity = "0";
        qCards[2].style.transform = "translateY(-60px) scale(1.04)";
        qCards[2].style.filter = "blur(8px)";
        qCards[2].style.zIndex = 4;
      }

      setTimeout(() => {
        queue = [incoming, queue[0], queue[1]];
        render(false);
      }, 1700);
    });
  });
}, 4000);

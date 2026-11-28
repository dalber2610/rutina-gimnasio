// Interaccione// 1. Navegación entre las 3 pantallas
const navButtons = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view');

function showView(viewName) {
  views.forEach((v) => {
    const active = v.id === `view-${viewName}`;
    v.hidden = !active;
    v.classList.toggle('is-active', active);
  });

  navButtons.forEach((btn) => {
    const active = btn.dataset.view === viewName;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-selected', String(active));
  });
}

navButtons.forEach((btn) => {
  btn.addEventListener('click', () => showView(btn.dataset.view));
});

// Iniciar rutina desde Pantalla 1 hacia Pantalla 2
const activeRoutineName = document.getElementById('active-routine-name');
document.querySelectorAll('[data-start-routine]').forEach((btn) => {
  btn.addEventListener('click', () => {
    activeRoutineName.textContent = btn.dataset.startRoutine;
    showView('workout');
  });
});

document.getElementById('btn-quick-start').addEventListener('click', () => {
  activeRoutineName.textContent = 'Entrenamiento libre';
  showView('workout');
});

// 2. Registro de series en vivo + cálculo de volumen
const setsBody = document.getElementById('sets-body');
const liveVolumeEl = document.getElementById('live-volume');
const liveSetsEl = document.getElementById('live-sets');

function updateWorkoutStats() {
  const rows = setsBody.querySelectorAll('tr');
  let volume = 0;
  let completed = 0;

  rows.forEach((row) => {
    const inputs = row.querySelectorAll('.set-input');
    const check = row.querySelector('.set-check');
    const weight = Number(inputs[0].value) || 0;
    const reps = Number(inputs[1].value) || 0;

    row.classList.toggle('row-done', check.checked);
    if (check.checked) {
      completed += 1;
      volume += weight * reps;
    }
  });

  liveVolumeEl.textContent = `${volume} kg`;
  liveSetsEl.textContent = `${completed} / ${rows.length}`;
}

setsBody.addEventListener('input', updateWorkoutStats);
setsBody.addEventListener('change', (e) => {
  updateWorkoutStats();
  if (e.target.classList.contains('set-check') && e.target.checked) {
    startTimer(90);
  }
});

// 3. Temporizador de descanso con Date.now() + Web Vibration API
let timerEndTime = null;
let timerInterval = null;
let remainingSeconds = 90;

const timerDisplay = document.getElementById('timer-display');
const timerStatus = document.getElementById('timer-status');
const btnTimerToggle = document.getElementById('btn-timer-toggle');

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function stopTimer(finished = false) {
  clearInterval(timerInterval);
  timerInterval = null;
  timerEndTime = null;
  btnTimerToggle.textContent = 'Iniciar';

  if (finished) {
    timerDisplay.textContent = '00:00';
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
      timerStatus.textContent = '¡Descanso terminado! (Vibración activada)';
    } else {
      timerStatus.textContent = '¡Descanso terminado! (Alerta visual)';
    }
  }
}

function startTimer(seconds = remainingSeconds) {
  stopTimer(false);
  remainingSeconds = Math.max(5, seconds);
  timerEndTime = Date.now() + remainingSeconds * 1000;
  btnTimerToggle.textContent = 'Pausar';
  timerStatus.textContent = 'Descansando...';
  timerDisplay.textContent = formatTime(remainingSeconds);

  timerInterval = setInterval(() => {
    const left = Math.ceil((timerEndTime - Date.now()) / 1000);
    if (left <= 0) {
      remainingSeconds = 90;
      stopTimer(true);
    } else {
      remainingSeconds = left;
      timerDisplay.textContent = formatTime(left);
    }
  }, 250);
}

btnTimerToggle.addEventListener('click', () => {
  if (timerInterval) {
    stopTimer(false);
    timerStatus.textContent = 'Pausado';
  } else {
    startTimer(remainingSeconds);
  }
});

document.getElementById('btn-timer-plus').addEventListener('click', () => {
  remainingSeconds += 15;
  if (timerInterval) startTimer(remainingSeconds);
  else timerDisplay.textContent = formatTime(remainingSeconds);
});

document.getElementById('btn-timer-minus').addEventListener('click', () => {
  remainingSeconds = Math.max(15, remainingSeconds - 15);
  if (timerInterval) startTimer(remainingSeconds);
  else timerDisplay.textContent = formatTime(remainingSeconds);
});

document.getElementById('btn-finish-workout').addEventListener('click', () => {
  stopTimer(false);
  showView('progress');
});

// 4. Gráfico SVG de progreso (sin librerías externas)
const progressData = [
  { date: 'Sem 1', maxWeight: 65, volume: 1450 },
  { date: 'Sem 2', maxWeight: 70, volume: 1620 },
  { date: 'Sem 3', maxWeight: 72.5, volume: 1710 },
  { date: 'Sem 4', maxWeight: 75, volume: 1840 },
  { date: 'Sem 5', maxWeight: 80, volume: 1960 },
];

const chartContainer = document.getElementById('progress-chart');
const chartTitle = document.getElementById('chart-title');
const historyList = document.getElementById('history-list');
const metricSelect = document.getElementById('metric-select');

function renderChart(metric) {
  const width = 560;
  const height = 220;
  const pad = 36;
  const values = progressData.map((d) => d[metric]);
  const maxVal = Math.max(...values) * 1.1;
  const minVal = Math.min(...values) * 0.9;

  const points = progressData.map((d, i) => {
    const x = pad + (i * (width - pad * 2)) / (progressData.length - 1);
    const y = height - pad - ((d[metric] - minVal) / (maxVal - minVal)) * (height - pad * 2);
    return { x, y, label: d.date, val: d[metric] };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');

  chartTitle.textContent =
    metric === 'maxWeight' ? 'Evolución de Peso Máximo (kg)' : 'Evolución de Volumen Total (kg)';

  chartContainer.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="auto">
      <polyline fill="none" stroke="#10B981" stroke-width="3" points="${polyline}" />
      ${points
        .map(
          (p) => `
        <circle cx="${p.x}" cy="${p.y}" r="5" fill="#2563EB" stroke="#F8FAFC" stroke-width="2" />
        <text x="${p.x}" y="${p.y - 12}" fill="#F8FAFC" font-size="12" text-anchor="middle">${p.val}</text>
        <text x="${p.x}" y="${height - 10}" fill="#94a3b8" font-size="12" text-anchor="middle">${p.label}</text>
      `
        )
        .join('')}
    </svg>
  `;

  historyList.innerHTML = progressData
    .slice()
    .reverse()
    .map(
      (d) =>
        `<li><span>${d.date} · Press de Banca</span><strong>${d.maxWeight} kg máx · ${d.volume} kg vol.</strong></li>`
    )
    .join('');
}

metricSelect.addEventListener('change', (e) => renderChart(e.target.value));
renderChart('maxWeight');s de tu recreación (JavaScript puro)

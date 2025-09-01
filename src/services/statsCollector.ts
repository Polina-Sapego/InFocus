let statsBuffer: Array<{ cardId: string; time: number }> = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

export function addStat(cardId: string, time: number) {
  statsBuffer.push({cardId, time});

  if (statsBuffer.length >= 10) {
    flushStats();
    return;
  }

  if (!flushTimer) {
    flushTimer = setTimeout(() => {
      flushStats();
    }, 5000)
  }
}

function flushStats() {
  if (statsBuffer.length === 0) return;

  const payload = [...statsBuffer];
  statsBuffer = [];
  flushTimer = null;

  fetch("http://localhost:3000/stats", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({events: payload}),
  }).catch(err => console.error("Ошибка отправки статистика", err))
}

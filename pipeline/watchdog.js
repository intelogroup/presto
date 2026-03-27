/**
 * Dead job watchdog — marks in-flight jobs as "error" if they show no progress
 * for more than stallMs milliseconds. Called on a regular interval from server.js.
 *
 * @param {Map} jobs - The shared in-memory job store
 * @param {{ stallMs: number }} opts
 * @returns {{ tick: () => void, start: (intervalMs: number) => NodeJS.Timeout }}
 */
function createWatchdog(jobs, { stallMs = 30 * 60 * 1000 } = {}) {
  const TERMINAL_STATUSES = new Set(["done", "error"]);

  function tick() {
    const now = Date.now();
    for (const [jobId, job] of jobs) {
      if (TERMINAL_STATUSES.has(job.status)) continue;
      const lastSeen = job.lastProgressAt ?? job.createdAt ?? 0;
      if (now - lastSeen > stallMs) {
        console.error(`[watchdog] job ${jobId} stalled at step="${job.step}" — marking error`);
        jobs.set(jobId, {
          ...job,
          status: "error",
          error: `Pipeline stalled: no progress for ${Math.round(stallMs / 60_000)} minutes`,
        });
      }
    }
  }

  function start(intervalMs = 5 * 60 * 1000) {
    return setInterval(tick, intervalMs);
  }

  return { tick, start };
}

module.exports = { createWatchdog };

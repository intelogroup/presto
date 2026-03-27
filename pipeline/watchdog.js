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

  /**
   * Scan the job map once. Any non-terminal job with no progress for longer than stallMs
   * is transitioned to status="error" with a descriptive message.
   */
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

  /**
   * Start the watchdog on a repeating interval.
   * @param {number} intervalMs - How often to run tick (default: 5 minutes).
   * @returns {NodeJS.Timeout} The interval handle — pass to clearInterval to stop.
   */
  function start(intervalMs = 5 * 60 * 1000) {
    return setInterval(tick, intervalMs);
  }

  return { tick, start };
}

module.exports = { createWatchdog };

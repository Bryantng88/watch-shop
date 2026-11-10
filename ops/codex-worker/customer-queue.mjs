const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Claim remains server-fenced. Run only one leased job at a time, drain ready
// work immediately, and retain the existing five-second steady idle/error rate.
export async function pollCustomerQueue({ runOnce, stopped, wait = sleep }) {
  let idleDelay = 1000;
  while (!stopped()) {
    const outcome = await runOnce();
    if (stopped()) return;
    if (outcome === 'processed') {
      idleDelay = 1000;
      continue;
    }
    await wait(outcome === 'idle' ? idleDelay : 5000);
    idleDelay = outcome === 'idle' ? Math.min(idleDelay * 2, 5000) : 5000;
  }
}

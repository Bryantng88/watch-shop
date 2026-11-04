export function localSalesSimulationEnabled(env: NodeJS.ProcessEnv = process.env) {
  if (env.NODE_ENV !== "development" || env.SALES_AI_LOCAL_SIMULATION !== "1") return false;
  try { return ["localhost", "127.0.0.1", "[::1]"].includes(new URL(env.APP_URL || "").hostname); }
  catch { return false; }
}

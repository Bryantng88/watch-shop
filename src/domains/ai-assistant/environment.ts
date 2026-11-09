export type BenEnvironment = 'production' | 'staging';

export function benEnvironment(
  env: Readonly<Record<string, string | undefined>>
): BenEnvironment | undefined {
  if (env.BEN_CUSTOMER_ENVIRONMENT === 'production') return 'production';
  if (env.PERSONAL_CODEX_ENVIRONMENT === 'staging') return 'staging';
  return undefined;
}

export function benEnvironmentLabel(
  live: boolean,
  environment?: BenEnvironment,
  sample = 'GIẢ LẬP'
) {
  return !live ? sample : environment === 'staging' ? 'STAGING' : null;
}

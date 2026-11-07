import { canReadRepository } from './repository-access';

export function canRequestProduction(actor: { id?: string; admin: boolean }) {
  const env = process.env;
  const token = env.BEN_PRODUCTION_GITHUB_TOKEN;
  return (
    canReadRepository(actor) &&
    env.BEN_PRODUCTION_RELEASE_ENABLED === '1' &&
    !!token &&
    token !== env.BEN_GITHUB_READ_TOKEN &&
    !!env.BEN_PRODUCTION_REQUIRED_CHECKS?.split(',').every((name) =>
      name.trim(),
    )
  );
}

type BindingIdentity = { targetType: unknown; targetId: unknown };
type TargetIdentity = { type: unknown; id: unknown };

function key(value: BindingIdentity | TargetIdentity) {
  if ("targetType" in value) return `${String(value.targetType)}:${String(value.targetId)}`;
  return `${String(value.type)}:${String(value.id)}`;
}

export function reconcilePersonalWorkBindings<TBinding extends BindingIdentity, TTarget extends TargetIdentity>(
  existing: TBinding[],
  desired: TTarget[],
) {
  const existingKeys = new Set(existing.map(key));
  const desiredKeys = new Set(desired.map(key));
  return {
    added: desired.filter((target) => !existingKeys.has(key(target))),
    removed: existing.filter((binding) => !desiredKeys.has(key(binding))),
  };
}


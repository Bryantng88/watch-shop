// Compatibility barrel. New code should import from the domain-specific files:
// - payment.core.ts
// - order-payment.service.ts
// - acquisition-payment.service.ts
// - service-issue-payment.service.ts
export * from "./payment.core";
export * from "./order-payment.service";
export * from "./acquisition-payment.service";
export * from "./service-issue-payment.service";

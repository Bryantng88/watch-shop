import { defineBusinessEventContract } from "@/domains/event/contract/business-event-contract.helpers";
import type { BusinessEventContract } from "@/domains/event/contract/business-event-contract.types";

export const PURCHASE_REQUEST_BUSINESS_EVENT_KEYS = [
  "purchase_request.created",
  "purchase_request.items_added",
  "purchase_request.email_verification_requested",
  "purchase_request.email_verification_sent",
  "purchase_request.email_verification_delivery_failed",
  "purchase_request.email_verified",
] as const;

export const PURCHASE_REQUEST_BUSINESS_EVENT_CONTRACTS: BusinessEventContract[] = [
  defineBusinessEventContract({
    key: "purchase_request.created",
    label: "Yêu cầu mua hàng được tạo",
    targetType: "PURCHASE_REQUEST",
    group: "Purchase Request",
    producer: "storefront",
    emitPoint: "submitPublicOrder create transaction",
    targetIdPolicy: "PurchaseRequest.id",
    knownConsumers: ["timeline", "notification"],
    payload: {
      name: "PurchaseRequestCreatedV1",
      version: 1,
      required: ["eventInstanceId", "purchaseRequestId", "reference", "channel", "productIds", "occurredAt"],
    },
  }),
  defineBusinessEventContract({
    key: "purchase_request.items_added",
    label: "Khách bổ sung Watch vào yêu cầu mua hàng",
    targetType: "PURCHASE_REQUEST",
    group: "Purchase Request",
    producer: "storefront",
    emitPoint: "submitPublicOrder merge transaction",
    targetIdPolicy: "PurchaseRequest.id",
    knownConsumers: ["timeline", "notification"],
    payload: {
      name: "PurchaseRequestItemsAddedV1",
      version: 1,
      required: ["eventInstanceId", "purchaseRequestId", "reference", "channel", "productIds", "addedItemCount", "occurredAt"],
    },
  }),
  ...[
    ["purchase_request.email_verification_requested", "Yêu cầu gửi email xác minh", ["timeline"]],
    ["purchase_request.email_verification_sent", "Đã gửi email xác minh", ["timeline"]],
    ["purchase_request.email_verification_delivery_failed", "Gửi email xác minh thất bại", ["timeline"]],
    ["purchase_request.email_verified", "Khách hàng đã xác minh email", ["timeline", "notification"]],
  ].map(([key, label, knownConsumers]) => defineBusinessEventContract({
    key: key as string,
    label: label as string,
    targetType: "PURCHASE_REQUEST",
    group: "Purchase Request",
    producer: "purchase-request",
    emitPoint: "purchase request email verification command",
    targetIdPolicy: "PurchaseRequest.id",
    knownConsumers: knownConsumers as string[],
    payload: {
      name: "PurchaseRequestEmailVerificationV1",
      version: 1,
      required: ["eventInstanceId", "purchaseRequestId", "reference", "occurredAt"],
      optional: ["actorUserId", "customerEmail", "failureCode"],
    },
  })),
];

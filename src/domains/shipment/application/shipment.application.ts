import {
  createManualShipment,
  createShipmentFeeAndShip,
  createShipmentReturnFee,
  getShipmentDetail,
  getActiveShipmentByOrderId,
  listShipments,
  markShipmentDelivered,
  markShipmentReturned,
  receiveShipmentReturn,
  updateShipment,
} from "../server";
import type {
  CompleteShipmentInput,
  CreateManualShipmentInput,
  CreateShipmentFeeInput,
  ReceiveShipmentReturnInput,
  ShipmentListInput,
  UpdateShipmentInput,
} from "../shared";

export async function listShipmentsApplication(input: ShipmentListInput) {
  return listShipments(input);
}

export async function getShipmentDetailApplication(shipmentId: string) {
  return getShipmentDetail(shipmentId);
}

export async function getActiveShipmentByOrderIdApplication(orderId: string) {
  return getActiveShipmentByOrderId(orderId);
}

export async function updateShipmentApplication(input: { shipmentId: string; data: UpdateShipmentInput }) {
  return updateShipment(input);
}

export async function createShipmentFeeAndShipApplication(input: CreateShipmentFeeInput) {
  return createShipmentFeeAndShip(input);
}

export async function markShipmentDeliveredApplication(input: CompleteShipmentInput) {
  return markShipmentDelivered(input);
}

export async function markShipmentReturnedApplication(input: CompleteShipmentInput) {
  return markShipmentReturned(input);
}

export async function receiveShipmentReturnApplication(input: ReceiveShipmentReturnInput) {
  return receiveShipmentReturn(input);
}

// Backward-compatible application name.
export async function createShipmentReturnFeeApplication(input: ReceiveShipmentReturnInput) {
  return createShipmentReturnFee(input);
}

export async function createManualShipmentApplication(input: CreateManualShipmentInput) {
  return createManualShipment(input);
}

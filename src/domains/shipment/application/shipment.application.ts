import {
  createShipmentFeeAndShip,
  getShipmentDetail,
  listShipments,
  markShipmentDelivered,
  markShipmentReturned,
  updateShipment,
  createManualShipment,
  createShipmentReturnFee,
} from "../server";
import type { CompleteShipmentInput, CreateShipmentFeeInput, ShipmentListInput, UpdateShipmentInput, CreateShipmentReturnFeeInput, } from "../shared";

export async function listShipmentsApplication(input: ShipmentListInput) {
  return listShipments(input);
}

export async function getShipmentDetailApplication(shipmentId: string) {
  return getShipmentDetail(shipmentId);
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

export async function createManualShipmentApplication(input: import("../shared").CreateManualShipmentInput) {
  return createManualShipment(input);
}
export async function createShipmentReturnFeeApplication(input: CreateShipmentReturnFeeInput) {
  return createShipmentReturnFee(input);
}
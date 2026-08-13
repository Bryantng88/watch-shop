import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { CarrierChargeKindSchema } from '../enums/CarrierChargeKind.schema';
import { EnumCarrierChargeKindFieldUpdateOperationsInputObjectSchema as EnumCarrierChargeKindFieldUpdateOperationsInputObjectSchema } from './EnumCarrierChargeKindFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { CarrierSettlementStatusSchema } from '../enums/CarrierSettlementStatus.schema';
import { EnumCarrierSettlementStatusFieldUpdateOperationsInputObjectSchema as EnumCarrierSettlementStatusFieldUpdateOperationsInputObjectSchema } from './EnumCarrierSettlementStatusFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ShipmentUpdateOneRequiredWithoutCarrierChargesNestedInputObjectSchema as ShipmentUpdateOneRequiredWithoutCarrierChargesNestedInputObjectSchema } from './ShipmentUpdateOneRequiredWithoutCarrierChargesNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  kind: z.union([CarrierChargeKindSchema, z.lazy(() => EnumCarrierChargeKindFieldUpdateOperationsInputObjectSchema)]).optional(),
  currency: z.union([z.string().max(10), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  estimatedAmount: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  chargedAmount: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  settlementStatus: z.union([CarrierSettlementStatusSchema, z.lazy(() => EnumCarrierSettlementStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  settlementRef: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  settledAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  shipment: z.lazy(() => ShipmentUpdateOneRequiredWithoutCarrierChargesNestedInputObjectSchema).optional()
}).strict();
export const CarrierChargeUpdateInputObjectSchema: z.ZodType<Prisma.CarrierChargeUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeUpdateInput>;
export const CarrierChargeUpdateInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemKindSchema } from '../enums/AcquisitionItemKind.schema';
import { AcquisitionItemStatusSchema } from '../enums/AcquisitionItemStatus.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  acquisitionId: z.string(),
  productId: z.string().optional().nullable(),
  variantId: z.string().optional().nullable(),
  quantity: z.number().int().optional(),
  unitCost: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  kind: AcquisitionItemKindSchema.optional().nullable(),
  status: AcquisitionItemStatusSchema.optional().nullable(),
  description: z.string().optional().nullable(),
  expectedReturnAt: z.coerce.date().optional().nullable(),
  returnedAt: z.coerce.date().optional().nullable(),
  vendorRmaNo: z.string().optional().nullable(),
  warrantyMonths: z.number().int().optional().nullable(),
  serviceRequestId: z.string().optional().nullable(),
  capitalizeToProduct: z.boolean().optional().nullable()
}).strict();
export const AcquisitionItemUncheckedCreateWithoutSourceOrderItemInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUncheckedCreateWithoutSourceOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUncheckedCreateWithoutSourceOrderItemInput>;
export const AcquisitionItemUncheckedCreateWithoutSourceOrderItemInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  brand: SortOrderSchema.optional(),
  model: SortOrderSchema.optional(),
  referenceNumber: SortOrderSchema.optional(),
  nickname: SortOrderSchema.optional(),
  caseShape: SortOrderSchema.optional(),
  caseSizeMM: SortOrderSchema.optional(),
  lugToLugMM: SortOrderSchema.optional(),
  lugWidthMM: SortOrderSchema.optional(),
  thicknessMM: SortOrderSchema.optional(),
  materialProfile: SortOrderSchema.optional(),
  primaryCaseMaterial: SortOrderSchema.optional(),
  secondaryCaseMaterial: SortOrderSchema.optional(),
  goldTreatment: SortOrderSchema.optional(),
  goldKarat: SortOrderSchema.optional(),
  materialNote: SortOrderSchema.optional(),
  dialColor: SortOrderSchema.optional(),
  dialFinish: SortOrderSchema.optional(),
  crystal: SortOrderSchema.optional(),
  movementType: SortOrderSchema.optional(),
  calibre: SortOrderSchema.optional(),
  powerReserve: SortOrderSchema.optional(),
  waterResistance: SortOrderSchema.optional(),
  braceletType: SortOrderSchema.optional(),
  strapMaterialText: SortOrderSchema.optional(),
  buckleType: SortOrderSchema.optional(),
  bookletIncluded: SortOrderSchema.optional(),
  cardIncluded: SortOrderSchema.optional(),
  strapSetType: SortOrderSchema.optional(),
  strapComponentSource: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const WatchSpecV2MaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WatchSpecV2MaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2MaxOrderByAggregateInput>;
export const WatchSpecV2MaxOrderByAggregateInputObjectZodSchema = makeSchema();

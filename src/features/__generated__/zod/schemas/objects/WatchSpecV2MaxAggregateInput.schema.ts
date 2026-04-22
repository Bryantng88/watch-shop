import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  watchId: z.literal(true).optional(),
  brand: z.literal(true).optional(),
  model: z.literal(true).optional(),
  referenceNumber: z.literal(true).optional(),
  nickname: z.literal(true).optional(),
  caseShape: z.literal(true).optional(),
  caseSizeMM: z.literal(true).optional(),
  lugToLugMM: z.literal(true).optional(),
  lugWidthMM: z.literal(true).optional(),
  thicknessMM: z.literal(true).optional(),
  materialProfile: z.literal(true).optional(),
  primaryCaseMaterial: z.literal(true).optional(),
  secondaryCaseMaterial: z.literal(true).optional(),
  goldTreatment: z.literal(true).optional(),
  goldKarat: z.literal(true).optional(),
  materialNote: z.literal(true).optional(),
  dialColor: z.literal(true).optional(),
  dialFinish: z.literal(true).optional(),
  crystal: z.literal(true).optional(),
  movementType: z.literal(true).optional(),
  calibre: z.literal(true).optional(),
  powerReserve: z.literal(true).optional(),
  waterResistance: z.literal(true).optional(),
  braceletType: z.literal(true).optional(),
  strapMaterialText: z.literal(true).optional(),
  buckleType: z.literal(true).optional(),
  bookletIncluded: z.literal(true).optional(),
  cardIncluded: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const WatchSpecV2MaxAggregateInputObjectSchema: z.ZodType<Prisma.WatchSpecV2MaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2MaxAggregateInputType>;
export const WatchSpecV2MaxAggregateInputObjectZodSchema = makeSchema();

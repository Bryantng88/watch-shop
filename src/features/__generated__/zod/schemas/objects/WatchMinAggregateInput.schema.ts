import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  legacyVariantId: z.literal(true).optional(),
  acquisitionId: z.literal(true).optional(),
  stockState: z.literal(true).optional(),
  saleState: z.literal(true).optional(),
  serviceState: z.literal(true).optional(),
  gender: z.literal(true).optional(),
  siteChannel: z.literal(true).optional(),
  conditionGrade: z.literal(true).optional(),
  movementType: z.literal(true).optional(),
  movementCalibre: z.literal(true).optional(),
  serialNumber: z.literal(true).optional(),
  yearText: z.literal(true).optional(),
  hasBox: z.literal(true).optional(),
  hasPapers: z.literal(true).optional(),
  attachedStrapId: z.literal(true).optional(),
  notes: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const WatchMinAggregateInputObjectSchema: z.ZodType<Prisma.WatchMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchMinAggregateInputType>;
export const WatchMinAggregateInputObjectZodSchema = makeSchema();

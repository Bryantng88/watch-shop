import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchArgsObjectSchema as WatchArgsObjectSchema } from './WatchArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  watchId: z.boolean().optional(),
  brand: z.boolean().optional(),
  model: z.boolean().optional(),
  referenceNumber: z.boolean().optional(),
  nickname: z.boolean().optional(),
  caseShape: z.boolean().optional(),
  caseSizeMM: z.boolean().optional(),
  lugToLugMM: z.boolean().optional(),
  lugWidthMM: z.boolean().optional(),
  thicknessMM: z.boolean().optional(),
  materialProfile: z.boolean().optional(),
  primaryCaseMaterial: z.boolean().optional(),
  secondaryCaseMaterial: z.boolean().optional(),
  goldTreatment: z.boolean().optional(),
  goldColors: z.boolean().optional(),
  goldKarat: z.boolean().optional(),
  materialNote: z.boolean().optional(),
  dialColor: z.boolean().optional(),
  dialFinish: z.boolean().optional(),
  crystal: z.boolean().optional(),
  movementType: z.boolean().optional(),
  calibre: z.boolean().optional(),
  powerReserve: z.boolean().optional(),
  waterResistance: z.boolean().optional(),
  braceletType: z.boolean().optional(),
  strapMaterialText: z.boolean().optional(),
  buckleType: z.boolean().optional(),
  bookletIncluded: z.boolean().optional(),
  cardIncluded: z.boolean().optional(),
  featuresJson: z.boolean().optional(),
  rawSpecJson: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  watch: z.union([z.boolean(), z.lazy(() => WatchArgsObjectSchema)]).optional()
}).strict();
export const WatchSpecV2SelectObjectSchema: z.ZodType<Prisma.WatchSpecV2Select> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2Select>;
export const WatchSpecV2SelectObjectZodSchema = makeSchema();

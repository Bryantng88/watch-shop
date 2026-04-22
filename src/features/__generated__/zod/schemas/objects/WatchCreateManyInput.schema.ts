import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSiteChannelSchema } from '../enums/WatchSiteChannel.schema';
import { GenderSchema } from '../enums/Gender.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { WatchSpecStatusSchema } from '../enums/WatchSpecStatus.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  productId: z.string(),
  legacyVariantId: z.string().optional().nullable(),
  acquisitionId: z.string().optional().nullable(),
  stockState: z.string().optional().nullable(),
  saleState: z.string().optional().nullable(),
  serviceState: z.string().optional().nullable(),
  siteChannel: WatchSiteChannelSchema.optional(),
  gender: GenderSchema.optional(),
  conditionGrade: z.string().optional().nullable(),
  movementType: MovementTypeSchema.optional().nullable(),
  movementCalibre: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  yearText: z.string().optional().nullable(),
  hasBox: z.boolean().optional(),
  hasPapers: z.boolean().optional(),
  specStatus: WatchSpecStatusSchema.optional(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const WatchCreateManyInputObjectSchema: z.ZodType<Prisma.WatchCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateManyInput>;
export const WatchCreateManyInputObjectZodSchema = makeSchema();

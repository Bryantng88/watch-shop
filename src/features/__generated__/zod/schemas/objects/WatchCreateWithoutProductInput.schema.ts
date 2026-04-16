import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GenderSchema } from '../enums/Gender.schema';
import { WatchSiteChannelSchema } from '../enums/WatchSiteChannel.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { WatchContentCreateNestedOneWithoutWatchInputObjectSchema as WatchContentCreateNestedOneWithoutWatchInputObjectSchema } from './WatchContentCreateNestedOneWithoutWatchInput.schema';
import { WatchMediaCreateNestedManyWithoutWatchInputObjectSchema as WatchMediaCreateNestedManyWithoutWatchInputObjectSchema } from './WatchMediaCreateNestedManyWithoutWatchInput.schema';
import { WatchPriceCreateNestedOneWithoutWatchInputObjectSchema as WatchPriceCreateNestedOneWithoutWatchInputObjectSchema } from './WatchPriceCreateNestedOneWithoutWatchInput.schema';
import { WatchSpecV2CreateNestedOneWithoutWatchInputObjectSchema as WatchSpecV2CreateNestedOneWithoutWatchInputObjectSchema } from './WatchSpecV2CreateNestedOneWithoutWatchInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  legacyVariantId: z.string().optional().nullable(),
  acquisitionId: z.string().optional().nullable(),
  stockState: z.string().optional().nullable(),
  saleState: z.string().optional().nullable(),
  serviceState: z.string().optional().nullable(),
  gender: GenderSchema.optional(),
  siteChannel: WatchSiteChannelSchema.optional(),
  conditionGrade: z.string().optional().nullable(),
  movementType: MovementTypeSchema.optional().nullable(),
  movementCalibre: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  yearText: z.string().optional().nullable(),
  hasBox: z.boolean().optional(),
  hasPapers: z.boolean().optional(),
  attachedStrapId: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  watchContent: z.lazy(() => WatchContentCreateNestedOneWithoutWatchInputObjectSchema).optional(),
  watchMedia: z.lazy(() => WatchMediaCreateNestedManyWithoutWatchInputObjectSchema).optional(),
  watchPrice: z.lazy(() => WatchPriceCreateNestedOneWithoutWatchInputObjectSchema).optional(),
  watchSpecV2: z.lazy(() => WatchSpecV2CreateNestedOneWithoutWatchInputObjectSchema).optional()
}).strict();
export const WatchCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.WatchCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateWithoutProductInput>;
export const WatchCreateWithoutProductInputObjectZodSchema = makeSchema();

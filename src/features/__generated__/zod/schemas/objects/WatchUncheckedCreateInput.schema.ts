import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GenderSchema } from '../enums/Gender.schema';
import { WatchSiteChannelSchema } from '../enums/WatchSiteChannel.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { WatchContentUncheckedCreateNestedOneWithoutWatchInputObjectSchema as WatchContentUncheckedCreateNestedOneWithoutWatchInputObjectSchema } from './WatchContentUncheckedCreateNestedOneWithoutWatchInput.schema';
import { WatchMediaUncheckedCreateNestedManyWithoutWatchInputObjectSchema as WatchMediaUncheckedCreateNestedManyWithoutWatchInputObjectSchema } from './WatchMediaUncheckedCreateNestedManyWithoutWatchInput.schema';
import { WatchPriceUncheckedCreateNestedOneWithoutWatchInputObjectSchema as WatchPriceUncheckedCreateNestedOneWithoutWatchInputObjectSchema } from './WatchPriceUncheckedCreateNestedOneWithoutWatchInput.schema';
import { WatchSpecV2UncheckedCreateNestedOneWithoutWatchInputObjectSchema as WatchSpecV2UncheckedCreateNestedOneWithoutWatchInputObjectSchema } from './WatchSpecV2UncheckedCreateNestedOneWithoutWatchInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  productId: z.string(),
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
  watchContent: z.lazy(() => WatchContentUncheckedCreateNestedOneWithoutWatchInputObjectSchema).optional(),
  watchMedia: z.lazy(() => WatchMediaUncheckedCreateNestedManyWithoutWatchInputObjectSchema),
  watchPrice: z.lazy(() => WatchPriceUncheckedCreateNestedOneWithoutWatchInputObjectSchema).optional(),
  watchSpecV2: z.lazy(() => WatchSpecV2UncheckedCreateNestedOneWithoutWatchInputObjectSchema).optional()
}).strict();
export const WatchUncheckedCreateInputObjectSchema: z.ZodType<Prisma.WatchUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUncheckedCreateInput>;
export const WatchUncheckedCreateInputObjectZodSchema = makeSchema();

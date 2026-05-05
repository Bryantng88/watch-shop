import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSiteChannelSchema } from '../enums/WatchSiteChannel.schema';
import { GenderSchema } from '../enums/Gender.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { WatchStyleSchema } from '../enums/WatchStyle.schema';
import { WatchSpecStatusSchema } from '../enums/WatchSpecStatus.schema';
import { ProductCreateNestedOneWithoutWatchInputObjectSchema as ProductCreateNestedOneWithoutWatchInputObjectSchema } from './ProductCreateNestedOneWithoutWatchInput.schema';
import { WatchContentCreateNestedOneWithoutWatchInputObjectSchema as WatchContentCreateNestedOneWithoutWatchInputObjectSchema } from './WatchContentCreateNestedOneWithoutWatchInput.schema';
import { WatchSpecV2CreateNestedOneWithoutWatchInputObjectSchema as WatchSpecV2CreateNestedOneWithoutWatchInputObjectSchema } from './WatchSpecV2CreateNestedOneWithoutWatchInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
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
  style: WatchStyleSchema.optional().nullable(),
  hasBox: z.boolean().optional(),
  hasPapers: z.boolean().optional(),
  specStatus: WatchSpecStatusSchema.optional(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  product: z.lazy(() => ProductCreateNestedOneWithoutWatchInputObjectSchema),
  watchContent: z.lazy(() => WatchContentCreateNestedOneWithoutWatchInputObjectSchema).optional(),
  watchSpecV2: z.lazy(() => WatchSpecV2CreateNestedOneWithoutWatchInputObjectSchema).optional()
}).strict();
export const WatchCreateWithoutWatchPriceInputObjectSchema: z.ZodType<Prisma.WatchCreateWithoutWatchPriceInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateWithoutWatchPriceInput>;
export const WatchCreateWithoutWatchPriceInputObjectZodSchema = makeSchema();

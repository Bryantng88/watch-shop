import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumWatchSiteChannelWithAggregatesFilterObjectSchema as EnumWatchSiteChannelWithAggregatesFilterObjectSchema } from './EnumWatchSiteChannelWithAggregatesFilter.schema';
import { WatchSiteChannelSchema } from '../enums/WatchSiteChannel.schema';
import { EnumGenderWithAggregatesFilterObjectSchema as EnumGenderWithAggregatesFilterObjectSchema } from './EnumGenderWithAggregatesFilter.schema';
import { GenderSchema } from '../enums/Gender.schema';
import { EnumMovementTypeNullableWithAggregatesFilterObjectSchema as EnumMovementTypeNullableWithAggregatesFilterObjectSchema } from './EnumMovementTypeNullableWithAggregatesFilter.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { EnumWatchSpecStatusWithAggregatesFilterObjectSchema as EnumWatchSpecStatusWithAggregatesFilterObjectSchema } from './EnumWatchSpecStatusWithAggregatesFilter.schema';
import { WatchSpecStatusSchema } from '../enums/WatchSpecStatus.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const watchscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WatchScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WatchScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  legacyVariantId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  acquisitionId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  stockState: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  saleState: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  serviceState: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  siteChannel: z.union([z.lazy(() => EnumWatchSiteChannelWithAggregatesFilterObjectSchema), WatchSiteChannelSchema]).optional(),
  gender: z.union([z.lazy(() => EnumGenderWithAggregatesFilterObjectSchema), GenderSchema]).optional(),
  conditionGrade: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  movementType: z.union([z.lazy(() => EnumMovementTypeNullableWithAggregatesFilterObjectSchema), MovementTypeSchema]).optional().nullable(),
  movementCalibre: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  serialNumber: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  yearText: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  hasBox: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  hasPapers: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  specStatus: z.union([z.lazy(() => EnumWatchSpecStatusWithAggregatesFilterObjectSchema), WatchSpecStatusSchema]).optional(),
  notes: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const WatchScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.WatchScalarWhereWithAggregatesInput> = watchscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.WatchScalarWhereWithAggregatesInput>;
export const WatchScalarWhereWithAggregatesInputObjectZodSchema = watchscalarwherewithaggregatesinputSchema;

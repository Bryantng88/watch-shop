import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumWatchSiteChannelFilterObjectSchema as EnumWatchSiteChannelFilterObjectSchema } from './EnumWatchSiteChannelFilter.schema';
import { WatchSiteChannelSchema } from '../enums/WatchSiteChannel.schema';
import { EnumGenderFilterObjectSchema as EnumGenderFilterObjectSchema } from './EnumGenderFilter.schema';
import { GenderSchema } from '../enums/Gender.schema';
import { EnumMovementTypeNullableFilterObjectSchema as EnumMovementTypeNullableFilterObjectSchema } from './EnumMovementTypeNullableFilter.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { EnumWatchSpecStatusFilterObjectSchema as EnumWatchSpecStatusFilterObjectSchema } from './EnumWatchSpecStatusFilter.schema';
import { WatchSpecStatusSchema } from '../enums/WatchSpecStatus.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProductScalarRelationFilterObjectSchema as ProductScalarRelationFilterObjectSchema } from './ProductScalarRelationFilter.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { WatchContentNullableScalarRelationFilterObjectSchema as WatchContentNullableScalarRelationFilterObjectSchema } from './WatchContentNullableScalarRelationFilter.schema';
import { WatchContentWhereInputObjectSchema as WatchContentWhereInputObjectSchema } from './WatchContentWhereInput.schema';
import { WatchPriceNullableScalarRelationFilterObjectSchema as WatchPriceNullableScalarRelationFilterObjectSchema } from './WatchPriceNullableScalarRelationFilter.schema';
import { WatchPriceWhereInputObjectSchema as WatchPriceWhereInputObjectSchema } from './WatchPriceWhereInput.schema';
import { WatchSpecV2NullableScalarRelationFilterObjectSchema as WatchSpecV2NullableScalarRelationFilterObjectSchema } from './WatchSpecV2NullableScalarRelationFilter.schema';
import { WatchSpecV2WhereInputObjectSchema as WatchSpecV2WhereInputObjectSchema } from './WatchSpecV2WhereInput.schema'

const watchwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchWhereInputObjectSchema), z.lazy(() => WatchWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchWhereInputObjectSchema), z.lazy(() => WatchWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  legacyVariantId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  acquisitionId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  stockState: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  saleState: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  serviceState: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  siteChannel: z.union([z.lazy(() => EnumWatchSiteChannelFilterObjectSchema), WatchSiteChannelSchema]).optional(),
  gender: z.union([z.lazy(() => EnumGenderFilterObjectSchema), GenderSchema]).optional(),
  conditionGrade: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  movementType: z.union([z.lazy(() => EnumMovementTypeNullableFilterObjectSchema), MovementTypeSchema]).optional().nullable(),
  movementCalibre: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  serialNumber: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  yearText: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  hasBox: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  hasPapers: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  specStatus: z.union([z.lazy(() => EnumWatchSpecStatusFilterObjectSchema), WatchSpecStatusSchema]).optional(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  product: z.union([z.lazy(() => ProductScalarRelationFilterObjectSchema), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  watchContent: z.union([z.lazy(() => WatchContentNullableScalarRelationFilterObjectSchema), z.lazy(() => WatchContentWhereInputObjectSchema)]).optional(),
  watchPrice: z.union([z.lazy(() => WatchPriceNullableScalarRelationFilterObjectSchema), z.lazy(() => WatchPriceWhereInputObjectSchema)]).optional(),
  watchSpecV2: z.union([z.lazy(() => WatchSpecV2NullableScalarRelationFilterObjectSchema), z.lazy(() => WatchSpecV2WhereInputObjectSchema)]).optional()
}).strict();
export const WatchWhereInputObjectSchema: z.ZodType<Prisma.WatchWhereInput> = watchwhereinputSchema as unknown as z.ZodType<Prisma.WatchWhereInput>;
export const WatchWhereInputObjectZodSchema = watchwhereinputSchema;

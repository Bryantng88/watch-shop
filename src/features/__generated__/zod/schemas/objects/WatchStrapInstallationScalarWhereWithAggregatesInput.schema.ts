import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumStrapOwnershipModeWithAggregatesFilterObjectSchema as EnumStrapOwnershipModeWithAggregatesFilterObjectSchema } from './EnumStrapOwnershipModeWithAggregatesFilter.schema';
import { StrapOwnershipModeSchema } from '../enums/StrapOwnershipMode.schema';
import { IntNullableWithAggregatesFilterObjectSchema as IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema'

const watchstrapinstallationscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchStrapInstallationScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WatchStrapInstallationScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchStrapInstallationScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchStrapInstallationScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WatchStrapInstallationScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  watchId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  strapVariantId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  ownershipMode: z.union([z.lazy(() => EnumStrapOwnershipModeWithAggregatesFilterObjectSchema), StrapOwnershipModeSchema]).optional(),
  installedFullLinks: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  installedHalfLinks: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  spareFullLinks: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  spareHalfLinks: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  endLinkCount: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  wristSizeMM: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  installedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  removedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  installedByUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  removedByUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  sourceOrderId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  serviceRequestId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const WatchStrapInstallationScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationScalarWhereWithAggregatesInput> = watchstrapinstallationscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.WatchStrapInstallationScalarWhereWithAggregatesInput>;
export const WatchStrapInstallationScalarWhereWithAggregatesInputObjectZodSchema = watchstrapinstallationscalarwherewithaggregatesinputSchema;

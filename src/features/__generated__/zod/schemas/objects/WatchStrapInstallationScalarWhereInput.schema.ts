import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumStrapOwnershipModeFilterObjectSchema as EnumStrapOwnershipModeFilterObjectSchema } from './EnumStrapOwnershipModeFilter.schema';
import { StrapOwnershipModeSchema } from '../enums/StrapOwnershipMode.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema'

const watchstrapinstallationscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchStrapInstallationScalarWhereInputObjectSchema), z.lazy(() => WatchStrapInstallationScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchStrapInstallationScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchStrapInstallationScalarWhereInputObjectSchema), z.lazy(() => WatchStrapInstallationScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  watchId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  strapVariantId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ownershipMode: z.union([z.lazy(() => EnumStrapOwnershipModeFilterObjectSchema), StrapOwnershipModeSchema]).optional(),
  installedFullLinks: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  installedHalfLinks: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  spareFullLinks: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  spareHalfLinks: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  endLinkCount: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  wristSizeMM: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  installedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  removedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  installedByUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  removedByUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sourceOrderId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  serviceRequestId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const WatchStrapInstallationScalarWhereInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationScalarWhereInput> = watchstrapinstallationscalarwhereinputSchema as unknown as z.ZodType<Prisma.WatchStrapInstallationScalarWhereInput>;
export const WatchStrapInstallationScalarWhereInputObjectZodSchema = watchstrapinstallationscalarwhereinputSchema;

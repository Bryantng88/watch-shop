import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumAppTagTargetTypeFilterObjectSchema as EnumAppTagTargetTypeFilterObjectSchema } from './EnumAppTagTargetTypeFilter.schema';
import { AppTagTargetTypeSchema } from '../enums/AppTagTargetType.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const apptaglinkscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => AppTagLinkScalarWhereInputObjectSchema), z.lazy(() => AppTagLinkScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AppTagLinkScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AppTagLinkScalarWhereInputObjectSchema), z.lazy(() => AppTagLinkScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tagId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => EnumAppTagTargetTypeFilterObjectSchema), AppTagTargetTypeSchema]).optional(),
  targetId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const AppTagLinkScalarWhereInputObjectSchema: z.ZodType<Prisma.AppTagLinkScalarWhereInput> = apptaglinkscalarwhereinputSchema as unknown as z.ZodType<Prisma.AppTagLinkScalarWhereInput>;
export const AppTagLinkScalarWhereInputObjectZodSchema = apptaglinkscalarwhereinputSchema;

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumAppTagTargetTypeFilterObjectSchema as EnumAppTagTargetTypeFilterObjectSchema } from './EnumAppTagTargetTypeFilter.schema';
import { AppTagTargetTypeSchema } from '../enums/AppTagTargetType.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { AppTagScalarRelationFilterObjectSchema as AppTagScalarRelationFilterObjectSchema } from './AppTagScalarRelationFilter.schema';
import { AppTagWhereInputObjectSchema as AppTagWhereInputObjectSchema } from './AppTagWhereInput.schema'

const apptaglinkwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => AppTagLinkWhereInputObjectSchema), z.lazy(() => AppTagLinkWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AppTagLinkWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AppTagLinkWhereInputObjectSchema), z.lazy(() => AppTagLinkWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tagId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => EnumAppTagTargetTypeFilterObjectSchema), AppTagTargetTypeSchema]).optional(),
  targetId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  tag: z.union([z.lazy(() => AppTagScalarRelationFilterObjectSchema), z.lazy(() => AppTagWhereInputObjectSchema)]).optional()
}).strict();
export const AppTagLinkWhereInputObjectSchema: z.ZodType<Prisma.AppTagLinkWhereInput> = apptaglinkwhereinputSchema as unknown as z.ZodType<Prisma.AppTagLinkWhereInput>;
export const AppTagLinkWhereInputObjectZodSchema = apptaglinkwhereinputSchema;

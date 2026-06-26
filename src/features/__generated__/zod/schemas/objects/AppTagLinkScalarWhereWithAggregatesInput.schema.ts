import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumAppTagTargetTypeWithAggregatesFilterObjectSchema as EnumAppTagTargetTypeWithAggregatesFilterObjectSchema } from './EnumAppTagTargetTypeWithAggregatesFilter.schema';
import { AppTagTargetTypeSchema } from '../enums/AppTagTargetType.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const apptaglinkscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => AppTagLinkScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AppTagLinkScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AppTagLinkScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AppTagLinkScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AppTagLinkScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  tagId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => EnumAppTagTargetTypeWithAggregatesFilterObjectSchema), AppTagTargetTypeSchema]).optional(),
  targetId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const AppTagLinkScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.AppTagLinkScalarWhereWithAggregatesInput> = apptaglinkscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.AppTagLinkScalarWhereWithAggregatesInput>;
export const AppTagLinkScalarWhereWithAggregatesInputObjectZodSchema = apptaglinkscalarwherewithaggregatesinputSchema;

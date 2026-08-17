import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const storefrontheroimagewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => StorefrontHeroImageWhereInputObjectSchema), z.lazy(() => StorefrontHeroImageWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => StorefrontHeroImageWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => StorefrontHeroImageWhereInputObjectSchema), z.lazy(() => StorefrontHeroImageWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  storageKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  derivativeKey: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  originalFileName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  altText: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  mimeType: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  sizeBytes: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  width: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  height: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  focalX: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  focalY: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  overlayOpacity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const StorefrontHeroImageWhereInputObjectSchema: z.ZodType<Prisma.StorefrontHeroImageWhereInput> = storefrontheroimagewhereinputSchema as unknown as z.ZodType<Prisma.StorefrontHeroImageWhereInput>;
export const StorefrontHeroImageWhereInputObjectZodSchema = storefrontheroimagewhereinputSchema;

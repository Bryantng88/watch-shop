import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { orderflowtypeSchema } from '../enums/orderflowtype.schema'

const nestedenumorderflowtypefilterSchema = z.object({
  equals: orderflowtypeSchema.optional(),
  in: orderflowtypeSchema.array().optional(),
  notIn: orderflowtypeSchema.array().optional(),
  not: z.union([orderflowtypeSchema, z.lazy(() => NestedEnumorderflowtypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumorderflowtypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumorderflowtypeFilter> = nestedenumorderflowtypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumorderflowtypeFilter>;
export const NestedEnumorderflowtypeFilterObjectZodSchema = nestedenumorderflowtypefilterSchema;

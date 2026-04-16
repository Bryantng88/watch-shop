import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { orderflowtypeSchema } from '../enums/orderflowtype.schema';
import { NestedEnumorderflowtypeFilterObjectSchema as NestedEnumorderflowtypeFilterObjectSchema } from './NestedEnumorderflowtypeFilter.schema'

const makeSchema = () => z.object({
  equals: orderflowtypeSchema.optional(),
  in: orderflowtypeSchema.array().optional(),
  notIn: orderflowtypeSchema.array().optional(),
  not: z.union([orderflowtypeSchema, z.lazy(() => NestedEnumorderflowtypeFilterObjectSchema)]).optional()
}).strict();
export const EnumorderflowtypeFilterObjectSchema: z.ZodType<Prisma.EnumorderflowtypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumorderflowtypeFilter>;
export const EnumorderflowtypeFilterObjectZodSchema = makeSchema();

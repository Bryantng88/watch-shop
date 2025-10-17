import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CaseMaterialSchema } from '../enums/CaseMaterial.schema';
import { NestedEnumCaseMaterialFilterObjectSchema as NestedEnumCaseMaterialFilterObjectSchema } from './NestedEnumCaseMaterialFilter.schema'

const makeSchema = () => z.object({
  equals: CaseMaterialSchema.optional(),
  in: CaseMaterialSchema.array().optional(),
  notIn: CaseMaterialSchema.array().optional(),
  not: z.union([CaseMaterialSchema, z.lazy(() => NestedEnumCaseMaterialFilterObjectSchema)]).optional()
}).strict();
export const EnumCaseMaterialFilterObjectSchema: z.ZodType<Prisma.EnumCaseMaterialFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumCaseMaterialFilter>;
export const EnumCaseMaterialFilterObjectZodSchema = makeSchema();

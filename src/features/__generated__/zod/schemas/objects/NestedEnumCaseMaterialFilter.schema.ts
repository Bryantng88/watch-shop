import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CaseMaterialSchema } from '../enums/CaseMaterial.schema'

const nestedenumcasematerialfilterSchema = z.object({
  equals: CaseMaterialSchema.optional(),
  in: CaseMaterialSchema.array().optional(),
  notIn: CaseMaterialSchema.array().optional(),
  not: z.union([CaseMaterialSchema, z.lazy(() => NestedEnumCaseMaterialFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumCaseMaterialFilterObjectSchema: z.ZodType<Prisma.NestedEnumCaseMaterialFilter> = nestedenumcasematerialfilterSchema as unknown as z.ZodType<Prisma.NestedEnumCaseMaterialFilter>;
export const NestedEnumCaseMaterialFilterObjectZodSchema = nestedenumcasematerialfilterSchema;

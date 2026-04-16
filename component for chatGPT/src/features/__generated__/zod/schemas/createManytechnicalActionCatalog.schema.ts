import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalActionCatalogCreateManyInputObjectSchema as technicalActionCatalogCreateManyInputObjectSchema } from './objects/technicalActionCatalogCreateManyInput.schema';

export const technicalActionCatalogCreateManySchema: z.ZodType<Prisma.technicalActionCatalogCreateManyArgs> = z.object({ data: z.union([ technicalActionCatalogCreateManyInputObjectSchema, z.array(technicalActionCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.technicalActionCatalogCreateManyArgs>;

export const technicalActionCatalogCreateManyZodSchema = z.object({ data: z.union([ technicalActionCatalogCreateManyInputObjectSchema, z.array(technicalActionCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
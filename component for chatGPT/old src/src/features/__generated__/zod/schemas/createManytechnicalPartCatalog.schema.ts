import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalPartCatalogCreateManyInputObjectSchema as technicalPartCatalogCreateManyInputObjectSchema } from './objects/technicalPartCatalogCreateManyInput.schema';

export const technicalPartCatalogCreateManySchema: z.ZodType<Prisma.technicalPartCatalogCreateManyArgs> = z.object({ data: z.union([ technicalPartCatalogCreateManyInputObjectSchema, z.array(technicalPartCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.technicalPartCatalogCreateManyArgs>;

export const technicalPartCatalogCreateManyZodSchema = z.object({ data: z.union([ technicalPartCatalogCreateManyInputObjectSchema, z.array(technicalPartCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
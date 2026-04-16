import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalPartCatalogSelectObjectSchema as technicalPartCatalogSelectObjectSchema } from './objects/technicalPartCatalogSelect.schema';
import { technicalPartCatalogCreateManyInputObjectSchema as technicalPartCatalogCreateManyInputObjectSchema } from './objects/technicalPartCatalogCreateManyInput.schema';

export const technicalPartCatalogCreateManyAndReturnSchema: z.ZodType<Prisma.technicalPartCatalogCreateManyAndReturnArgs> = z.object({ select: technicalPartCatalogSelectObjectSchema.optional(), data: z.union([ technicalPartCatalogCreateManyInputObjectSchema, z.array(technicalPartCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.technicalPartCatalogCreateManyAndReturnArgs>;

export const technicalPartCatalogCreateManyAndReturnZodSchema = z.object({ select: technicalPartCatalogSelectObjectSchema.optional(), data: z.union([ technicalPartCatalogCreateManyInputObjectSchema, z.array(technicalPartCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
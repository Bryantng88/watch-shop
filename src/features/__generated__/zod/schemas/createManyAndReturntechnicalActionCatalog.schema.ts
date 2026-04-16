import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalActionCatalogSelectObjectSchema as technicalActionCatalogSelectObjectSchema } from './objects/technicalActionCatalogSelect.schema';
import { technicalActionCatalogCreateManyInputObjectSchema as technicalActionCatalogCreateManyInputObjectSchema } from './objects/technicalActionCatalogCreateManyInput.schema';

export const technicalActionCatalogCreateManyAndReturnSchema: z.ZodType<Prisma.technicalActionCatalogCreateManyAndReturnArgs> = z.object({ select: technicalActionCatalogSelectObjectSchema.optional(), data: z.union([ technicalActionCatalogCreateManyInputObjectSchema, z.array(technicalActionCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.technicalActionCatalogCreateManyAndReturnArgs>;

export const technicalActionCatalogCreateManyAndReturnZodSchema = z.object({ select: technicalActionCatalogSelectObjectSchema.optional(), data: z.union([ technicalActionCatalogCreateManyInputObjectSchema, z.array(technicalActionCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MechanicalPartCatalogSelectObjectSchema as MechanicalPartCatalogSelectObjectSchema } from './objects/MechanicalPartCatalogSelect.schema';
import { MechanicalPartCatalogCreateManyInputObjectSchema as MechanicalPartCatalogCreateManyInputObjectSchema } from './objects/MechanicalPartCatalogCreateManyInput.schema';

export const MechanicalPartCatalogCreateManyAndReturnSchema: z.ZodType<Prisma.MechanicalPartCatalogCreateManyAndReturnArgs> = z.object({ select: MechanicalPartCatalogSelectObjectSchema.optional(), data: z.union([ MechanicalPartCatalogCreateManyInputObjectSchema, z.array(MechanicalPartCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.MechanicalPartCatalogCreateManyAndReturnArgs>;

export const MechanicalPartCatalogCreateManyAndReturnZodSchema = z.object({ select: MechanicalPartCatalogSelectObjectSchema.optional(), data: z.union([ MechanicalPartCatalogCreateManyInputObjectSchema, z.array(MechanicalPartCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
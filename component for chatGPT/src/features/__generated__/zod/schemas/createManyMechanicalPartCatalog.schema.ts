import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MechanicalPartCatalogCreateManyInputObjectSchema as MechanicalPartCatalogCreateManyInputObjectSchema } from './objects/MechanicalPartCatalogCreateManyInput.schema';

export const MechanicalPartCatalogCreateManySchema: z.ZodType<Prisma.MechanicalPartCatalogCreateManyArgs> = z.object({ data: z.union([ MechanicalPartCatalogCreateManyInputObjectSchema, z.array(MechanicalPartCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.MechanicalPartCatalogCreateManyArgs>;

export const MechanicalPartCatalogCreateManyZodSchema = z.object({ data: z.union([ MechanicalPartCatalogCreateManyInputObjectSchema, z.array(MechanicalPartCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
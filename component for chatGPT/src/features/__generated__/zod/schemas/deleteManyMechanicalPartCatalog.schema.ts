import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MechanicalPartCatalogWhereInputObjectSchema as MechanicalPartCatalogWhereInputObjectSchema } from './objects/MechanicalPartCatalogWhereInput.schema';

export const MechanicalPartCatalogDeleteManySchema: z.ZodType<Prisma.MechanicalPartCatalogDeleteManyArgs> = z.object({ where: MechanicalPartCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MechanicalPartCatalogDeleteManyArgs>;

export const MechanicalPartCatalogDeleteManyZodSchema = z.object({ where: MechanicalPartCatalogWhereInputObjectSchema.optional() }).strict();
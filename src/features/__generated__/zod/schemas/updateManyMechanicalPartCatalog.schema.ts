import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MechanicalPartCatalogUpdateManyMutationInputObjectSchema as MechanicalPartCatalogUpdateManyMutationInputObjectSchema } from './objects/MechanicalPartCatalogUpdateManyMutationInput.schema';
import { MechanicalPartCatalogWhereInputObjectSchema as MechanicalPartCatalogWhereInputObjectSchema } from './objects/MechanicalPartCatalogWhereInput.schema';

export const MechanicalPartCatalogUpdateManySchema: z.ZodType<Prisma.MechanicalPartCatalogUpdateManyArgs> = z.object({ data: MechanicalPartCatalogUpdateManyMutationInputObjectSchema, where: MechanicalPartCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MechanicalPartCatalogUpdateManyArgs>;

export const MechanicalPartCatalogUpdateManyZodSchema = z.object({ data: MechanicalPartCatalogUpdateManyMutationInputObjectSchema, where: MechanicalPartCatalogWhereInputObjectSchema.optional() }).strict();
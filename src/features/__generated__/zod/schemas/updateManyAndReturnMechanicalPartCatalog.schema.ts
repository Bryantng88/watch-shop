import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MechanicalPartCatalogSelectObjectSchema as MechanicalPartCatalogSelectObjectSchema } from './objects/MechanicalPartCatalogSelect.schema';
import { MechanicalPartCatalogUpdateManyMutationInputObjectSchema as MechanicalPartCatalogUpdateManyMutationInputObjectSchema } from './objects/MechanicalPartCatalogUpdateManyMutationInput.schema';
import { MechanicalPartCatalogWhereInputObjectSchema as MechanicalPartCatalogWhereInputObjectSchema } from './objects/MechanicalPartCatalogWhereInput.schema';

export const MechanicalPartCatalogUpdateManyAndReturnSchema: z.ZodType<Prisma.MechanicalPartCatalogUpdateManyAndReturnArgs> = z.object({ select: MechanicalPartCatalogSelectObjectSchema.optional(), data: MechanicalPartCatalogUpdateManyMutationInputObjectSchema, where: MechanicalPartCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MechanicalPartCatalogUpdateManyAndReturnArgs>;

export const MechanicalPartCatalogUpdateManyAndReturnZodSchema = z.object({ select: MechanicalPartCatalogSelectObjectSchema.optional(), data: MechanicalPartCatalogUpdateManyMutationInputObjectSchema, where: MechanicalPartCatalogWhereInputObjectSchema.optional() }).strict();
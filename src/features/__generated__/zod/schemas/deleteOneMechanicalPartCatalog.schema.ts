import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MechanicalPartCatalogSelectObjectSchema as MechanicalPartCatalogSelectObjectSchema } from './objects/MechanicalPartCatalogSelect.schema';
import { MechanicalPartCatalogIncludeObjectSchema as MechanicalPartCatalogIncludeObjectSchema } from './objects/MechanicalPartCatalogInclude.schema';
import { MechanicalPartCatalogWhereUniqueInputObjectSchema as MechanicalPartCatalogWhereUniqueInputObjectSchema } from './objects/MechanicalPartCatalogWhereUniqueInput.schema';

export const MechanicalPartCatalogDeleteOneSchema: z.ZodType<Prisma.MechanicalPartCatalogDeleteArgs> = z.object({ select: MechanicalPartCatalogSelectObjectSchema.optional(), include: MechanicalPartCatalogIncludeObjectSchema.optional(), where: MechanicalPartCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MechanicalPartCatalogDeleteArgs>;

export const MechanicalPartCatalogDeleteOneZodSchema = z.object({ select: MechanicalPartCatalogSelectObjectSchema.optional(), include: MechanicalPartCatalogIncludeObjectSchema.optional(), where: MechanicalPartCatalogWhereUniqueInputObjectSchema }).strict();
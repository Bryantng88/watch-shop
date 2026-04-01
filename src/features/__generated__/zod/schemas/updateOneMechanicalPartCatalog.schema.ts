import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MechanicalPartCatalogSelectObjectSchema as MechanicalPartCatalogSelectObjectSchema } from './objects/MechanicalPartCatalogSelect.schema';
import { MechanicalPartCatalogIncludeObjectSchema as MechanicalPartCatalogIncludeObjectSchema } from './objects/MechanicalPartCatalogInclude.schema';
import { MechanicalPartCatalogUpdateInputObjectSchema as MechanicalPartCatalogUpdateInputObjectSchema } from './objects/MechanicalPartCatalogUpdateInput.schema';
import { MechanicalPartCatalogUncheckedUpdateInputObjectSchema as MechanicalPartCatalogUncheckedUpdateInputObjectSchema } from './objects/MechanicalPartCatalogUncheckedUpdateInput.schema';
import { MechanicalPartCatalogWhereUniqueInputObjectSchema as MechanicalPartCatalogWhereUniqueInputObjectSchema } from './objects/MechanicalPartCatalogWhereUniqueInput.schema';

export const MechanicalPartCatalogUpdateOneSchema: z.ZodType<Prisma.MechanicalPartCatalogUpdateArgs> = z.object({ select: MechanicalPartCatalogSelectObjectSchema.optional(), include: MechanicalPartCatalogIncludeObjectSchema.optional(), data: z.union([MechanicalPartCatalogUpdateInputObjectSchema, MechanicalPartCatalogUncheckedUpdateInputObjectSchema]), where: MechanicalPartCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MechanicalPartCatalogUpdateArgs>;

export const MechanicalPartCatalogUpdateOneZodSchema = z.object({ select: MechanicalPartCatalogSelectObjectSchema.optional(), include: MechanicalPartCatalogIncludeObjectSchema.optional(), data: z.union([MechanicalPartCatalogUpdateInputObjectSchema, MechanicalPartCatalogUncheckedUpdateInputObjectSchema]), where: MechanicalPartCatalogWhereUniqueInputObjectSchema }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MechanicalPartCatalogSelectObjectSchema as MechanicalPartCatalogSelectObjectSchema } from './objects/MechanicalPartCatalogSelect.schema';
import { MechanicalPartCatalogIncludeObjectSchema as MechanicalPartCatalogIncludeObjectSchema } from './objects/MechanicalPartCatalogInclude.schema';
import { MechanicalPartCatalogWhereUniqueInputObjectSchema as MechanicalPartCatalogWhereUniqueInputObjectSchema } from './objects/MechanicalPartCatalogWhereUniqueInput.schema';

export const MechanicalPartCatalogFindUniqueOrThrowSchema: z.ZodType<Prisma.MechanicalPartCatalogFindUniqueOrThrowArgs> = z.object({ select: MechanicalPartCatalogSelectObjectSchema.optional(), include: MechanicalPartCatalogIncludeObjectSchema.optional(), where: MechanicalPartCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MechanicalPartCatalogFindUniqueOrThrowArgs>;

export const MechanicalPartCatalogFindUniqueOrThrowZodSchema = z.object({ select: MechanicalPartCatalogSelectObjectSchema.optional(), include: MechanicalPartCatalogIncludeObjectSchema.optional(), where: MechanicalPartCatalogWhereUniqueInputObjectSchema }).strict();
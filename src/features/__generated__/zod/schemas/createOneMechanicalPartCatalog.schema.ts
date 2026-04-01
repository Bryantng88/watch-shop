import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MechanicalPartCatalogSelectObjectSchema as MechanicalPartCatalogSelectObjectSchema } from './objects/MechanicalPartCatalogSelect.schema';
import { MechanicalPartCatalogIncludeObjectSchema as MechanicalPartCatalogIncludeObjectSchema } from './objects/MechanicalPartCatalogInclude.schema';
import { MechanicalPartCatalogCreateInputObjectSchema as MechanicalPartCatalogCreateInputObjectSchema } from './objects/MechanicalPartCatalogCreateInput.schema';
import { MechanicalPartCatalogUncheckedCreateInputObjectSchema as MechanicalPartCatalogUncheckedCreateInputObjectSchema } from './objects/MechanicalPartCatalogUncheckedCreateInput.schema';

export const MechanicalPartCatalogCreateOneSchema: z.ZodType<Prisma.MechanicalPartCatalogCreateArgs> = z.object({ select: MechanicalPartCatalogSelectObjectSchema.optional(), include: MechanicalPartCatalogIncludeObjectSchema.optional(), data: z.union([MechanicalPartCatalogCreateInputObjectSchema, MechanicalPartCatalogUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.MechanicalPartCatalogCreateArgs>;

export const MechanicalPartCatalogCreateOneZodSchema = z.object({ select: MechanicalPartCatalogSelectObjectSchema.optional(), include: MechanicalPartCatalogIncludeObjectSchema.optional(), data: z.union([MechanicalPartCatalogCreateInputObjectSchema, MechanicalPartCatalogUncheckedCreateInputObjectSchema]) }).strict();
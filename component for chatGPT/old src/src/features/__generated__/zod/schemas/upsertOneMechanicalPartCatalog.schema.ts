import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MechanicalPartCatalogSelectObjectSchema as MechanicalPartCatalogSelectObjectSchema } from './objects/MechanicalPartCatalogSelect.schema';
import { MechanicalPartCatalogIncludeObjectSchema as MechanicalPartCatalogIncludeObjectSchema } from './objects/MechanicalPartCatalogInclude.schema';
import { MechanicalPartCatalogWhereUniqueInputObjectSchema as MechanicalPartCatalogWhereUniqueInputObjectSchema } from './objects/MechanicalPartCatalogWhereUniqueInput.schema';
import { MechanicalPartCatalogCreateInputObjectSchema as MechanicalPartCatalogCreateInputObjectSchema } from './objects/MechanicalPartCatalogCreateInput.schema';
import { MechanicalPartCatalogUncheckedCreateInputObjectSchema as MechanicalPartCatalogUncheckedCreateInputObjectSchema } from './objects/MechanicalPartCatalogUncheckedCreateInput.schema';
import { MechanicalPartCatalogUpdateInputObjectSchema as MechanicalPartCatalogUpdateInputObjectSchema } from './objects/MechanicalPartCatalogUpdateInput.schema';
import { MechanicalPartCatalogUncheckedUpdateInputObjectSchema as MechanicalPartCatalogUncheckedUpdateInputObjectSchema } from './objects/MechanicalPartCatalogUncheckedUpdateInput.schema';

export const MechanicalPartCatalogUpsertOneSchema: z.ZodType<Prisma.MechanicalPartCatalogUpsertArgs> = z.object({ select: MechanicalPartCatalogSelectObjectSchema.optional(), include: MechanicalPartCatalogIncludeObjectSchema.optional(), where: MechanicalPartCatalogWhereUniqueInputObjectSchema, create: z.union([ MechanicalPartCatalogCreateInputObjectSchema, MechanicalPartCatalogUncheckedCreateInputObjectSchema ]), update: z.union([ MechanicalPartCatalogUpdateInputObjectSchema, MechanicalPartCatalogUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.MechanicalPartCatalogUpsertArgs>;

export const MechanicalPartCatalogUpsertOneZodSchema = z.object({ select: MechanicalPartCatalogSelectObjectSchema.optional(), include: MechanicalPartCatalogIncludeObjectSchema.optional(), where: MechanicalPartCatalogWhereUniqueInputObjectSchema, create: z.union([ MechanicalPartCatalogCreateInputObjectSchema, MechanicalPartCatalogUncheckedCreateInputObjectSchema ]), update: z.union([ MechanicalPartCatalogUpdateInputObjectSchema, MechanicalPartCatalogUncheckedUpdateInputObjectSchema ]) }).strict();
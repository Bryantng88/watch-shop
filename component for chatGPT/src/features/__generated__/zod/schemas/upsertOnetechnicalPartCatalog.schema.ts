import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalPartCatalogSelectObjectSchema as technicalPartCatalogSelectObjectSchema } from './objects/technicalPartCatalogSelect.schema';
import { technicalPartCatalogWhereUniqueInputObjectSchema as technicalPartCatalogWhereUniqueInputObjectSchema } from './objects/technicalPartCatalogWhereUniqueInput.schema';
import { technicalPartCatalogCreateInputObjectSchema as technicalPartCatalogCreateInputObjectSchema } from './objects/technicalPartCatalogCreateInput.schema';
import { technicalPartCatalogUncheckedCreateInputObjectSchema as technicalPartCatalogUncheckedCreateInputObjectSchema } from './objects/technicalPartCatalogUncheckedCreateInput.schema';
import { technicalPartCatalogUpdateInputObjectSchema as technicalPartCatalogUpdateInputObjectSchema } from './objects/technicalPartCatalogUpdateInput.schema';
import { technicalPartCatalogUncheckedUpdateInputObjectSchema as technicalPartCatalogUncheckedUpdateInputObjectSchema } from './objects/technicalPartCatalogUncheckedUpdateInput.schema';

export const technicalPartCatalogUpsertOneSchema: z.ZodType<Prisma.technicalPartCatalogUpsertArgs> = z.object({ select: technicalPartCatalogSelectObjectSchema.optional(),  where: technicalPartCatalogWhereUniqueInputObjectSchema, create: z.union([ technicalPartCatalogCreateInputObjectSchema, technicalPartCatalogUncheckedCreateInputObjectSchema ]), update: z.union([ technicalPartCatalogUpdateInputObjectSchema, technicalPartCatalogUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.technicalPartCatalogUpsertArgs>;

export const technicalPartCatalogUpsertOneZodSchema = z.object({ select: technicalPartCatalogSelectObjectSchema.optional(),  where: technicalPartCatalogWhereUniqueInputObjectSchema, create: z.union([ technicalPartCatalogCreateInputObjectSchema, technicalPartCatalogUncheckedCreateInputObjectSchema ]), update: z.union([ technicalPartCatalogUpdateInputObjectSchema, technicalPartCatalogUncheckedUpdateInputObjectSchema ]) }).strict();
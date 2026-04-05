import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalActionCatalogSelectObjectSchema as technicalActionCatalogSelectObjectSchema } from './objects/technicalActionCatalogSelect.schema';
import { technicalActionCatalogWhereUniqueInputObjectSchema as technicalActionCatalogWhereUniqueInputObjectSchema } from './objects/technicalActionCatalogWhereUniqueInput.schema';
import { technicalActionCatalogCreateInputObjectSchema as technicalActionCatalogCreateInputObjectSchema } from './objects/technicalActionCatalogCreateInput.schema';
import { technicalActionCatalogUncheckedCreateInputObjectSchema as technicalActionCatalogUncheckedCreateInputObjectSchema } from './objects/technicalActionCatalogUncheckedCreateInput.schema';
import { technicalActionCatalogUpdateInputObjectSchema as technicalActionCatalogUpdateInputObjectSchema } from './objects/technicalActionCatalogUpdateInput.schema';
import { technicalActionCatalogUncheckedUpdateInputObjectSchema as technicalActionCatalogUncheckedUpdateInputObjectSchema } from './objects/technicalActionCatalogUncheckedUpdateInput.schema';

export const technicalActionCatalogUpsertOneSchema: z.ZodType<Prisma.technicalActionCatalogUpsertArgs> = z.object({ select: technicalActionCatalogSelectObjectSchema.optional(),  where: technicalActionCatalogWhereUniqueInputObjectSchema, create: z.union([ technicalActionCatalogCreateInputObjectSchema, technicalActionCatalogUncheckedCreateInputObjectSchema ]), update: z.union([ technicalActionCatalogUpdateInputObjectSchema, technicalActionCatalogUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.technicalActionCatalogUpsertArgs>;

export const technicalActionCatalogUpsertOneZodSchema = z.object({ select: technicalActionCatalogSelectObjectSchema.optional(),  where: technicalActionCatalogWhereUniqueInputObjectSchema, create: z.union([ technicalActionCatalogCreateInputObjectSchema, technicalActionCatalogUncheckedCreateInputObjectSchema ]), update: z.union([ technicalActionCatalogUpdateInputObjectSchema, technicalActionCatalogUncheckedUpdateInputObjectSchema ]) }).strict();
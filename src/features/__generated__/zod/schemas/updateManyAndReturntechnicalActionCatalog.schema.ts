import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalActionCatalogSelectObjectSchema as technicalActionCatalogSelectObjectSchema } from './objects/technicalActionCatalogSelect.schema';
import { technicalActionCatalogUpdateManyMutationInputObjectSchema as technicalActionCatalogUpdateManyMutationInputObjectSchema } from './objects/technicalActionCatalogUpdateManyMutationInput.schema';
import { technicalActionCatalogWhereInputObjectSchema as technicalActionCatalogWhereInputObjectSchema } from './objects/technicalActionCatalogWhereInput.schema';

export const technicalActionCatalogUpdateManyAndReturnSchema: z.ZodType<Prisma.technicalActionCatalogUpdateManyAndReturnArgs> = z.object({ select: technicalActionCatalogSelectObjectSchema.optional(), data: technicalActionCatalogUpdateManyMutationInputObjectSchema, where: technicalActionCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.technicalActionCatalogUpdateManyAndReturnArgs>;

export const technicalActionCatalogUpdateManyAndReturnZodSchema = z.object({ select: technicalActionCatalogSelectObjectSchema.optional(), data: technicalActionCatalogUpdateManyMutationInputObjectSchema, where: technicalActionCatalogWhereInputObjectSchema.optional() }).strict();
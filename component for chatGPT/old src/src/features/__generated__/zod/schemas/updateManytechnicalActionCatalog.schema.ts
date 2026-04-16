import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalActionCatalogUpdateManyMutationInputObjectSchema as technicalActionCatalogUpdateManyMutationInputObjectSchema } from './objects/technicalActionCatalogUpdateManyMutationInput.schema';
import { technicalActionCatalogWhereInputObjectSchema as technicalActionCatalogWhereInputObjectSchema } from './objects/technicalActionCatalogWhereInput.schema';

export const technicalActionCatalogUpdateManySchema: z.ZodType<Prisma.technicalActionCatalogUpdateManyArgs> = z.object({ data: technicalActionCatalogUpdateManyMutationInputObjectSchema, where: technicalActionCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.technicalActionCatalogUpdateManyArgs>;

export const technicalActionCatalogUpdateManyZodSchema = z.object({ data: technicalActionCatalogUpdateManyMutationInputObjectSchema, where: technicalActionCatalogWhereInputObjectSchema.optional() }).strict();
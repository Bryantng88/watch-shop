import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalPartCatalogUpdateManyMutationInputObjectSchema as technicalPartCatalogUpdateManyMutationInputObjectSchema } from './objects/technicalPartCatalogUpdateManyMutationInput.schema';
import { technicalPartCatalogWhereInputObjectSchema as technicalPartCatalogWhereInputObjectSchema } from './objects/technicalPartCatalogWhereInput.schema';

export const technicalPartCatalogUpdateManySchema: z.ZodType<Prisma.technicalPartCatalogUpdateManyArgs> = z.object({ data: technicalPartCatalogUpdateManyMutationInputObjectSchema, where: technicalPartCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.technicalPartCatalogUpdateManyArgs>;

export const technicalPartCatalogUpdateManyZodSchema = z.object({ data: technicalPartCatalogUpdateManyMutationInputObjectSchema, where: technicalPartCatalogWhereInputObjectSchema.optional() }).strict();
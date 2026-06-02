import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalDetailCatalogUpdateManyMutationInputObjectSchema as TechnicalDetailCatalogUpdateManyMutationInputObjectSchema } from './objects/TechnicalDetailCatalogUpdateManyMutationInput.schema';
import { TechnicalDetailCatalogWhereInputObjectSchema as TechnicalDetailCatalogWhereInputObjectSchema } from './objects/TechnicalDetailCatalogWhereInput.schema';

export const TechnicalDetailCatalogUpdateManySchema: z.ZodType<Prisma.TechnicalDetailCatalogUpdateManyArgs> = z.object({ data: TechnicalDetailCatalogUpdateManyMutationInputObjectSchema, where: TechnicalDetailCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogUpdateManyArgs>;

export const TechnicalDetailCatalogUpdateManyZodSchema = z.object({ data: TechnicalDetailCatalogUpdateManyMutationInputObjectSchema, where: TechnicalDetailCatalogWhereInputObjectSchema.optional() }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapCatalogOptionWhereInputObjectSchema as StrapCatalogOptionWhereInputObjectSchema } from './objects/StrapCatalogOptionWhereInput.schema';

export const StrapCatalogOptionDeleteManySchema: z.ZodType<Prisma.StrapCatalogOptionDeleteManyArgs> = z.object({ where: StrapCatalogOptionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.StrapCatalogOptionDeleteManyArgs>;

export const StrapCatalogOptionDeleteManyZodSchema = z.object({ where: StrapCatalogOptionWhereInputObjectSchema.optional() }).strict();
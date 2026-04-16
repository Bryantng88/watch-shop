import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapVariantSpecWhereInputObjectSchema as StrapVariantSpecWhereInputObjectSchema } from './objects/StrapVariantSpecWhereInput.schema';

export const StrapVariantSpecDeleteManySchema: z.ZodType<Prisma.StrapVariantSpecDeleteManyArgs> = z.object({ where: StrapVariantSpecWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.StrapVariantSpecDeleteManyArgs>;

export const StrapVariantSpecDeleteManyZodSchema = z.object({ where: StrapVariantSpecWhereInputObjectSchema.optional() }).strict();
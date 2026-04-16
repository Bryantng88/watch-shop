import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapVariantSpecUpdateManyMutationInputObjectSchema as StrapVariantSpecUpdateManyMutationInputObjectSchema } from './objects/StrapVariantSpecUpdateManyMutationInput.schema';
import { StrapVariantSpecWhereInputObjectSchema as StrapVariantSpecWhereInputObjectSchema } from './objects/StrapVariantSpecWhereInput.schema';

export const StrapVariantSpecUpdateManySchema: z.ZodType<Prisma.StrapVariantSpecUpdateManyArgs> = z.object({ data: StrapVariantSpecUpdateManyMutationInputObjectSchema, where: StrapVariantSpecWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.StrapVariantSpecUpdateManyArgs>;

export const StrapVariantSpecUpdateManyZodSchema = z.object({ data: StrapVariantSpecUpdateManyMutationInputObjectSchema, where: StrapVariantSpecWhereInputObjectSchema.optional() }).strict();
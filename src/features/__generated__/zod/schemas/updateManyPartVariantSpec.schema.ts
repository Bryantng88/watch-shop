import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PartVariantSpecUpdateManyMutationInputObjectSchema as PartVariantSpecUpdateManyMutationInputObjectSchema } from './objects/PartVariantSpecUpdateManyMutationInput.schema';
import { PartVariantSpecWhereInputObjectSchema as PartVariantSpecWhereInputObjectSchema } from './objects/PartVariantSpecWhereInput.schema';

export const PartVariantSpecUpdateManySchema: z.ZodType<Prisma.PartVariantSpecUpdateManyArgs> = z.object({ data: PartVariantSpecUpdateManyMutationInputObjectSchema, where: PartVariantSpecWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PartVariantSpecUpdateManyArgs>;

export const PartVariantSpecUpdateManyZodSchema = z.object({ data: PartVariantSpecUpdateManyMutationInputObjectSchema, where: PartVariantSpecWhereInputObjectSchema.optional() }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ClaspVariantSpecSelectObjectSchema as ClaspVariantSpecSelectObjectSchema } from './objects/ClaspVariantSpecSelect.schema';
import { ClaspVariantSpecUpdateManyMutationInputObjectSchema as ClaspVariantSpecUpdateManyMutationInputObjectSchema } from './objects/ClaspVariantSpecUpdateManyMutationInput.schema';
import { ClaspVariantSpecWhereInputObjectSchema as ClaspVariantSpecWhereInputObjectSchema } from './objects/ClaspVariantSpecWhereInput.schema';

export const ClaspVariantSpecUpdateManyAndReturnSchema: z.ZodType<Prisma.ClaspVariantSpecUpdateManyAndReturnArgs> = z.object({ select: ClaspVariantSpecSelectObjectSchema.optional(), data: ClaspVariantSpecUpdateManyMutationInputObjectSchema, where: ClaspVariantSpecWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ClaspVariantSpecUpdateManyAndReturnArgs>;

export const ClaspVariantSpecUpdateManyAndReturnZodSchema = z.object({ select: ClaspVariantSpecSelectObjectSchema.optional(), data: ClaspVariantSpecUpdateManyMutationInputObjectSchema, where: ClaspVariantSpecWhereInputObjectSchema.optional() }).strict();
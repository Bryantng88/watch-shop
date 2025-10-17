import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapVariantSpecSelectObjectSchema as StrapVariantSpecSelectObjectSchema } from './objects/StrapVariantSpecSelect.schema';
import { StrapVariantSpecUpdateManyMutationInputObjectSchema as StrapVariantSpecUpdateManyMutationInputObjectSchema } from './objects/StrapVariantSpecUpdateManyMutationInput.schema';
import { StrapVariantSpecWhereInputObjectSchema as StrapVariantSpecWhereInputObjectSchema } from './objects/StrapVariantSpecWhereInput.schema';

export const StrapVariantSpecUpdateManyAndReturnSchema: z.ZodType<Prisma.StrapVariantSpecUpdateManyAndReturnArgs> = z.object({ select: StrapVariantSpecSelectObjectSchema.optional(), data: StrapVariantSpecUpdateManyMutationInputObjectSchema, where: StrapVariantSpecWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.StrapVariantSpecUpdateManyAndReturnArgs>;

export const StrapVariantSpecUpdateManyAndReturnZodSchema = z.object({ select: StrapVariantSpecSelectObjectSchema.optional(), data: StrapVariantSpecUpdateManyMutationInputObjectSchema, where: StrapVariantSpecWhereInputObjectSchema.optional() }).strict();
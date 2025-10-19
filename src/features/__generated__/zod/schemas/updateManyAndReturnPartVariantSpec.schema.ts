import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PartVariantSpecSelectObjectSchema as PartVariantSpecSelectObjectSchema } from './objects/PartVariantSpecSelect.schema';
import { PartVariantSpecUpdateManyMutationInputObjectSchema as PartVariantSpecUpdateManyMutationInputObjectSchema } from './objects/PartVariantSpecUpdateManyMutationInput.schema';
import { PartVariantSpecWhereInputObjectSchema as PartVariantSpecWhereInputObjectSchema } from './objects/PartVariantSpecWhereInput.schema';

export const PartVariantSpecUpdateManyAndReturnSchema: z.ZodType<Prisma.PartVariantSpecUpdateManyAndReturnArgs> = z.object({ select: PartVariantSpecSelectObjectSchema.optional(), data: PartVariantSpecUpdateManyMutationInputObjectSchema, where: PartVariantSpecWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PartVariantSpecUpdateManyAndReturnArgs>;

export const PartVariantSpecUpdateManyAndReturnZodSchema = z.object({ select: PartVariantSpecSelectObjectSchema.optional(), data: PartVariantSpecUpdateManyMutationInputObjectSchema, where: PartVariantSpecWhereInputObjectSchema.optional() }).strict();
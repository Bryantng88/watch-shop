import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ClaspVariantSpecSelectObjectSchema as ClaspVariantSpecSelectObjectSchema } from './objects/ClaspVariantSpecSelect.schema';
import { ClaspVariantSpecIncludeObjectSchema as ClaspVariantSpecIncludeObjectSchema } from './objects/ClaspVariantSpecInclude.schema';
import { ClaspVariantSpecWhereUniqueInputObjectSchema as ClaspVariantSpecWhereUniqueInputObjectSchema } from './objects/ClaspVariantSpecWhereUniqueInput.schema';

export const ClaspVariantSpecFindUniqueOrThrowSchema: z.ZodType<Prisma.ClaspVariantSpecFindUniqueOrThrowArgs> = z.object({ select: ClaspVariantSpecSelectObjectSchema.optional(), include: ClaspVariantSpecIncludeObjectSchema.optional(), where: ClaspVariantSpecWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ClaspVariantSpecFindUniqueOrThrowArgs>;

export const ClaspVariantSpecFindUniqueOrThrowZodSchema = z.object({ select: ClaspVariantSpecSelectObjectSchema.optional(), include: ClaspVariantSpecIncludeObjectSchema.optional(), where: ClaspVariantSpecWhereUniqueInputObjectSchema }).strict();
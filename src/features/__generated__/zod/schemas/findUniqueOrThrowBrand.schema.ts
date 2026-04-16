import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BrandSelectObjectSchema as BrandSelectObjectSchema } from './objects/BrandSelect.schema';
import { BrandIncludeObjectSchema as BrandIncludeObjectSchema } from './objects/BrandInclude.schema';
import { BrandWhereUniqueInputObjectSchema as BrandWhereUniqueInputObjectSchema } from './objects/BrandWhereUniqueInput.schema';

export const BrandFindUniqueOrThrowSchema: z.ZodType<Prisma.BrandFindUniqueOrThrowArgs> = z.object({ select: BrandSelectObjectSchema.optional(), include: BrandIncludeObjectSchema.optional(), where: BrandWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BrandFindUniqueOrThrowArgs>;

export const BrandFindUniqueOrThrowZodSchema = z.object({ select: BrandSelectObjectSchema.optional(), include: BrandIncludeObjectSchema.optional(), where: BrandWhereUniqueInputObjectSchema }).strict();
import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  variantId: z.string().optional()
}).strict();
export const ClaspVariantSpecWhereUniqueInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecWhereUniqueInput>;
export const ClaspVariantSpecWhereUniqueInputObjectZodSchema = makeSchema();

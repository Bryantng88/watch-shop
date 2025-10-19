import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  variantId: z.string().optional()
}).strict();
export const PartVariantSpecWhereUniqueInputObjectSchema: z.ZodType<Prisma.PartVariantSpecWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecWhereUniqueInput>;
export const PartVariantSpecWhereUniqueInputObjectZodSchema = makeSchema();

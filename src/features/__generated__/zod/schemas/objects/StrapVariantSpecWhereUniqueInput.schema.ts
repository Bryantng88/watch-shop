import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  variantId: z.string().optional()
}).strict();
export const StrapVariantSpecWhereUniqueInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecWhereUniqueInput>;
export const StrapVariantSpecWhereUniqueInputObjectZodSchema = makeSchema();

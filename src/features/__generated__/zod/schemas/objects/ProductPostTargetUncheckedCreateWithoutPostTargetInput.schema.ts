import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  productId: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();
export const ProductPostTargetUncheckedCreateWithoutPostTargetInputObjectSchema: z.ZodType<Prisma.ProductPostTargetUncheckedCreateWithoutPostTargetInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetUncheckedCreateWithoutPostTargetInput>;
export const ProductPostTargetUncheckedCreateWithoutPostTargetInputObjectZodSchema = makeSchema();

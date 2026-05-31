import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  productId: z.string(),
  postTargetId: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();
export const ProductPostTargetUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ProductPostTargetUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetUncheckedCreateInput>;
export const ProductPostTargetUncheckedCreateInputObjectZodSchema = makeSchema();

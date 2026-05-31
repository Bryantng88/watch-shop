import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  postTargetId: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();
export const ProductPostTargetUncheckedCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductPostTargetUncheckedCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetUncheckedCreateWithoutProductInput>;
export const ProductPostTargetUncheckedCreateWithoutProductInputObjectZodSchema = makeSchema();

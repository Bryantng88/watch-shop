import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const PurchaseRequestActivityWhereUniqueInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityWhereUniqueInput>;
export const PurchaseRequestActivityWhereUniqueInputObjectZodSchema = makeSchema();

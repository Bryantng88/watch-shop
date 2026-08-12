import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  requestKey: z.string().optional()
}).strict();
export const PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptWhereUniqueInput>;
export const PurchaseRequestIngressReceiptWhereUniqueInputObjectZodSchema = makeSchema();

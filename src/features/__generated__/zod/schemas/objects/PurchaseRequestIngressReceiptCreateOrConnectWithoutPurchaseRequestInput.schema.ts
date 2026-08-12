import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema as PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema } from './PurchaseRequestIngressReceiptWhereUniqueInput.schema';
import { PurchaseRequestIngressReceiptCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptCreateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PurchaseRequestIngressReceiptCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInputObjectSchema)])
}).strict();
export const PurchaseRequestIngressReceiptCreateOrConnectWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptCreateOrConnectWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptCreateOrConnectWithoutPurchaseRequestInput>;
export const PurchaseRequestIngressReceiptCreateOrConnectWithoutPurchaseRequestInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema as PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema } from './PurchaseRequestIngressReceiptWhereUniqueInput.schema';
import { PurchaseRequestIngressReceiptUpdateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptUpdateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptUpdateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestIngressReceiptUncheckedUpdateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptUncheckedUpdateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptUncheckedUpdateWithoutPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => PurchaseRequestIngressReceiptUpdateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptUncheckedUpdateWithoutPurchaseRequestInputObjectSchema)])
}).strict();
export const PurchaseRequestIngressReceiptUpdateWithWhereUniqueWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptUpdateWithWhereUniqueWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptUpdateWithWhereUniqueWithoutPurchaseRequestInput>;
export const PurchaseRequestIngressReceiptUpdateWithWhereUniqueWithoutPurchaseRequestInputObjectZodSchema = makeSchema();

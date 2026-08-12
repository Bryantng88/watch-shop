import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema as PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema } from './PurchaseRequestIngressReceiptWhereUniqueInput.schema';
import { PurchaseRequestIngressReceiptUpdateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptUpdateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptUpdateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestIngressReceiptUncheckedUpdateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptUncheckedUpdateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptUncheckedUpdateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestIngressReceiptCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptCreateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => PurchaseRequestIngressReceiptUpdateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptUncheckedUpdateWithoutPurchaseRequestInputObjectSchema)]),
  create: z.union([z.lazy(() => PurchaseRequestIngressReceiptCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInputObjectSchema)])
}).strict();
export const PurchaseRequestIngressReceiptUpsertWithWhereUniqueWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptUpsertWithWhereUniqueWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptUpsertWithWhereUniqueWithoutPurchaseRequestInput>;
export const PurchaseRequestIngressReceiptUpsertWithWhereUniqueWithoutPurchaseRequestInputObjectZodSchema = makeSchema();

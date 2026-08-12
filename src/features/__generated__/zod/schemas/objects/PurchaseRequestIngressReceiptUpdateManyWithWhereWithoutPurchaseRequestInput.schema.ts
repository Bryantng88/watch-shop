import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestIngressReceiptScalarWhereInputObjectSchema as PurchaseRequestIngressReceiptScalarWhereInputObjectSchema } from './PurchaseRequestIngressReceiptScalarWhereInput.schema';
import { PurchaseRequestIngressReceiptUpdateManyMutationInputObjectSchema as PurchaseRequestIngressReceiptUpdateManyMutationInputObjectSchema } from './PurchaseRequestIngressReceiptUpdateManyMutationInput.schema';
import { PurchaseRequestIngressReceiptUncheckedUpdateManyWithoutPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptUncheckedUpdateManyWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptUncheckedUpdateManyWithoutPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestIngressReceiptScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => PurchaseRequestIngressReceiptUpdateManyMutationInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptUncheckedUpdateManyWithoutPurchaseRequestInputObjectSchema)])
}).strict();
export const PurchaseRequestIngressReceiptUpdateManyWithWhereWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptUpdateManyWithWhereWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptUpdateManyWithWhereWithoutPurchaseRequestInput>;
export const PurchaseRequestIngressReceiptUpdateManyWithWhereWithoutPurchaseRequestInputObjectZodSchema = makeSchema();

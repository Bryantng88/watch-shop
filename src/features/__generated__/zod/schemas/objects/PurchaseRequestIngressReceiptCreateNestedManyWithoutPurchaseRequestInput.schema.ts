import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestIngressReceiptCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptCreateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestIngressReceiptCreateOrConnectWithoutPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptCreateOrConnectWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptCreateOrConnectWithoutPurchaseRequestInput.schema';
import { PurchaseRequestIngressReceiptCreateManyPurchaseRequestInputEnvelopeObjectSchema as PurchaseRequestIngressReceiptCreateManyPurchaseRequestInputEnvelopeObjectSchema } from './PurchaseRequestIngressReceiptCreateManyPurchaseRequestInputEnvelope.schema';
import { PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema as PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema } from './PurchaseRequestIngressReceiptWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestIngressReceiptCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptCreateWithoutPurchaseRequestInputObjectSchema).array(), z.lazy(() => PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PurchaseRequestIngressReceiptCreateOrConnectWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptCreateOrConnectWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PurchaseRequestIngressReceiptCreateManyPurchaseRequestInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const PurchaseRequestIngressReceiptCreateNestedManyWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptCreateNestedManyWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptCreateNestedManyWithoutPurchaseRequestInput>;
export const PurchaseRequestIngressReceiptCreateNestedManyWithoutPurchaseRequestInputObjectZodSchema = makeSchema();

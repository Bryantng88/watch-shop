import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestIngressReceiptCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptCreateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestIngressReceiptCreateOrConnectWithoutPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptCreateOrConnectWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptCreateOrConnectWithoutPurchaseRequestInput.schema';
import { PurchaseRequestIngressReceiptUpsertWithWhereUniqueWithoutPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptUpsertWithWhereUniqueWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptUpsertWithWhereUniqueWithoutPurchaseRequestInput.schema';
import { PurchaseRequestIngressReceiptCreateManyPurchaseRequestInputEnvelopeObjectSchema as PurchaseRequestIngressReceiptCreateManyPurchaseRequestInputEnvelopeObjectSchema } from './PurchaseRequestIngressReceiptCreateManyPurchaseRequestInputEnvelope.schema';
import { PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema as PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema } from './PurchaseRequestIngressReceiptWhereUniqueInput.schema';
import { PurchaseRequestIngressReceiptUpdateWithWhereUniqueWithoutPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptUpdateWithWhereUniqueWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptUpdateWithWhereUniqueWithoutPurchaseRequestInput.schema';
import { PurchaseRequestIngressReceiptUpdateManyWithWhereWithoutPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptUpdateManyWithWhereWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptUpdateManyWithWhereWithoutPurchaseRequestInput.schema';
import { PurchaseRequestIngressReceiptScalarWhereInputObjectSchema as PurchaseRequestIngressReceiptScalarWhereInputObjectSchema } from './PurchaseRequestIngressReceiptScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestIngressReceiptCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptCreateWithoutPurchaseRequestInputObjectSchema).array(), z.lazy(() => PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PurchaseRequestIngressReceiptCreateOrConnectWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptCreateOrConnectWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PurchaseRequestIngressReceiptUpsertWithWhereUniqueWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptUpsertWithWhereUniqueWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PurchaseRequestIngressReceiptCreateManyPurchaseRequestInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => PurchaseRequestIngressReceiptUpdateWithWhereUniqueWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptUpdateWithWhereUniqueWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PurchaseRequestIngressReceiptUpdateManyWithWhereWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptUpdateManyWithWhereWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PurchaseRequestIngressReceiptScalarWhereInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const PurchaseRequestIngressReceiptUpdateManyWithoutPurchaseRequestNestedInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptUpdateManyWithoutPurchaseRequestNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptUpdateManyWithoutPurchaseRequestNestedInput>;
export const PurchaseRequestIngressReceiptUpdateManyWithoutPurchaseRequestNestedInputObjectZodSchema = makeSchema();

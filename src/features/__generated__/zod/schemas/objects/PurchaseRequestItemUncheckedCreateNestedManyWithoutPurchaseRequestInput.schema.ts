import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemCreateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestItemCreateOrConnectWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemCreateOrConnectWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemCreateOrConnectWithoutPurchaseRequestInput.schema';
import { PurchaseRequestItemCreateManyPurchaseRequestInputEnvelopeObjectSchema as PurchaseRequestItemCreateManyPurchaseRequestInputEnvelopeObjectSchema } from './PurchaseRequestItemCreateManyPurchaseRequestInputEnvelope.schema';
import { PurchaseRequestItemWhereUniqueInputObjectSchema as PurchaseRequestItemWhereUniqueInputObjectSchema } from './PurchaseRequestItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestItemCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestItemCreateWithoutPurchaseRequestInputObjectSchema).array(), z.lazy(() => PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PurchaseRequestItemCreateOrConnectWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestItemCreateOrConnectWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PurchaseRequestItemCreateManyPurchaseRequestInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const PurchaseRequestItemUncheckedCreateNestedManyWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemUncheckedCreateNestedManyWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemUncheckedCreateNestedManyWithoutPurchaseRequestInput>;
export const PurchaseRequestItemUncheckedCreateNestedManyWithoutPurchaseRequestInputObjectZodSchema = makeSchema();

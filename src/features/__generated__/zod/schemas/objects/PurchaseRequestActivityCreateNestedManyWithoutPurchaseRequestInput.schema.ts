import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestActivityCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityCreateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestActivityCreateOrConnectWithoutPurchaseRequestInputObjectSchema as PurchaseRequestActivityCreateOrConnectWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityCreateOrConnectWithoutPurchaseRequestInput.schema';
import { PurchaseRequestActivityCreateManyPurchaseRequestInputEnvelopeObjectSchema as PurchaseRequestActivityCreateManyPurchaseRequestInputEnvelopeObjectSchema } from './PurchaseRequestActivityCreateManyPurchaseRequestInputEnvelope.schema';
import { PurchaseRequestActivityWhereUniqueInputObjectSchema as PurchaseRequestActivityWhereUniqueInputObjectSchema } from './PurchaseRequestActivityWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestActivityCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestActivityCreateWithoutPurchaseRequestInputObjectSchema).array(), z.lazy(() => PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PurchaseRequestActivityCreateOrConnectWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestActivityCreateOrConnectWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PurchaseRequestActivityCreateManyPurchaseRequestInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const PurchaseRequestActivityCreateNestedManyWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityCreateNestedManyWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityCreateNestedManyWithoutPurchaseRequestInput>;
export const PurchaseRequestActivityCreateNestedManyWithoutPurchaseRequestInputObjectZodSchema = makeSchema();

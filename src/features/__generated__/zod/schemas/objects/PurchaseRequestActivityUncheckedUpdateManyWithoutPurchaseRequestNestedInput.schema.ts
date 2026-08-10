import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestActivityCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityCreateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestActivityCreateOrConnectWithoutPurchaseRequestInputObjectSchema as PurchaseRequestActivityCreateOrConnectWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityCreateOrConnectWithoutPurchaseRequestInput.schema';
import { PurchaseRequestActivityUpsertWithWhereUniqueWithoutPurchaseRequestInputObjectSchema as PurchaseRequestActivityUpsertWithWhereUniqueWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityUpsertWithWhereUniqueWithoutPurchaseRequestInput.schema';
import { PurchaseRequestActivityCreateManyPurchaseRequestInputEnvelopeObjectSchema as PurchaseRequestActivityCreateManyPurchaseRequestInputEnvelopeObjectSchema } from './PurchaseRequestActivityCreateManyPurchaseRequestInputEnvelope.schema';
import { PurchaseRequestActivityWhereUniqueInputObjectSchema as PurchaseRequestActivityWhereUniqueInputObjectSchema } from './PurchaseRequestActivityWhereUniqueInput.schema';
import { PurchaseRequestActivityUpdateWithWhereUniqueWithoutPurchaseRequestInputObjectSchema as PurchaseRequestActivityUpdateWithWhereUniqueWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityUpdateWithWhereUniqueWithoutPurchaseRequestInput.schema';
import { PurchaseRequestActivityUpdateManyWithWhereWithoutPurchaseRequestInputObjectSchema as PurchaseRequestActivityUpdateManyWithWhereWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityUpdateManyWithWhereWithoutPurchaseRequestInput.schema';
import { PurchaseRequestActivityScalarWhereInputObjectSchema as PurchaseRequestActivityScalarWhereInputObjectSchema } from './PurchaseRequestActivityScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestActivityCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestActivityCreateWithoutPurchaseRequestInputObjectSchema).array(), z.lazy(() => PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PurchaseRequestActivityCreateOrConnectWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestActivityCreateOrConnectWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PurchaseRequestActivityUpsertWithWhereUniqueWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestActivityUpsertWithWhereUniqueWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PurchaseRequestActivityCreateManyPurchaseRequestInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => PurchaseRequestActivityUpdateWithWhereUniqueWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestActivityUpdateWithWhereUniqueWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PurchaseRequestActivityUpdateManyWithWhereWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestActivityUpdateManyWithWhereWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PurchaseRequestActivityScalarWhereInputObjectSchema), z.lazy(() => PurchaseRequestActivityScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const PurchaseRequestActivityUncheckedUpdateManyWithoutPurchaseRequestNestedInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityUncheckedUpdateManyWithoutPurchaseRequestNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityUncheckedUpdateManyWithoutPurchaseRequestNestedInput>;
export const PurchaseRequestActivityUncheckedUpdateManyWithoutPurchaseRequestNestedInputObjectZodSchema = makeSchema();

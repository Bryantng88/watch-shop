import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemCreateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestItemCreateOrConnectWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemCreateOrConnectWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemCreateOrConnectWithoutPurchaseRequestInput.schema';
import { PurchaseRequestItemUpsertWithWhereUniqueWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemUpsertWithWhereUniqueWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemUpsertWithWhereUniqueWithoutPurchaseRequestInput.schema';
import { PurchaseRequestItemCreateManyPurchaseRequestInputEnvelopeObjectSchema as PurchaseRequestItemCreateManyPurchaseRequestInputEnvelopeObjectSchema } from './PurchaseRequestItemCreateManyPurchaseRequestInputEnvelope.schema';
import { PurchaseRequestItemWhereUniqueInputObjectSchema as PurchaseRequestItemWhereUniqueInputObjectSchema } from './PurchaseRequestItemWhereUniqueInput.schema';
import { PurchaseRequestItemUpdateWithWhereUniqueWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemUpdateWithWhereUniqueWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemUpdateWithWhereUniqueWithoutPurchaseRequestInput.schema';
import { PurchaseRequestItemUpdateManyWithWhereWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemUpdateManyWithWhereWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemUpdateManyWithWhereWithoutPurchaseRequestInput.schema';
import { PurchaseRequestItemScalarWhereInputObjectSchema as PurchaseRequestItemScalarWhereInputObjectSchema } from './PurchaseRequestItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestItemCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestItemCreateWithoutPurchaseRequestInputObjectSchema).array(), z.lazy(() => PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PurchaseRequestItemCreateOrConnectWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestItemCreateOrConnectWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PurchaseRequestItemUpsertWithWhereUniqueWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestItemUpsertWithWhereUniqueWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PurchaseRequestItemCreateManyPurchaseRequestInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => PurchaseRequestItemUpdateWithWhereUniqueWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestItemUpdateWithWhereUniqueWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PurchaseRequestItemUpdateManyWithWhereWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestItemUpdateManyWithWhereWithoutPurchaseRequestInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PurchaseRequestItemScalarWhereInputObjectSchema), z.lazy(() => PurchaseRequestItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const PurchaseRequestItemUpdateManyWithoutPurchaseRequestNestedInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemUpdateManyWithoutPurchaseRequestNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemUpdateManyWithoutPurchaseRequestNestedInput>;
export const PurchaseRequestItemUpdateManyWithoutPurchaseRequestNestedInputObjectZodSchema = makeSchema();

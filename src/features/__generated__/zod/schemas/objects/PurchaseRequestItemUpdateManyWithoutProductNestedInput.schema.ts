import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemCreateWithoutProductInputObjectSchema as PurchaseRequestItemCreateWithoutProductInputObjectSchema } from './PurchaseRequestItemCreateWithoutProductInput.schema';
import { PurchaseRequestItemUncheckedCreateWithoutProductInputObjectSchema as PurchaseRequestItemUncheckedCreateWithoutProductInputObjectSchema } from './PurchaseRequestItemUncheckedCreateWithoutProductInput.schema';
import { PurchaseRequestItemCreateOrConnectWithoutProductInputObjectSchema as PurchaseRequestItemCreateOrConnectWithoutProductInputObjectSchema } from './PurchaseRequestItemCreateOrConnectWithoutProductInput.schema';
import { PurchaseRequestItemUpsertWithWhereUniqueWithoutProductInputObjectSchema as PurchaseRequestItemUpsertWithWhereUniqueWithoutProductInputObjectSchema } from './PurchaseRequestItemUpsertWithWhereUniqueWithoutProductInput.schema';
import { PurchaseRequestItemCreateManyProductInputEnvelopeObjectSchema as PurchaseRequestItemCreateManyProductInputEnvelopeObjectSchema } from './PurchaseRequestItemCreateManyProductInputEnvelope.schema';
import { PurchaseRequestItemWhereUniqueInputObjectSchema as PurchaseRequestItemWhereUniqueInputObjectSchema } from './PurchaseRequestItemWhereUniqueInput.schema';
import { PurchaseRequestItemUpdateWithWhereUniqueWithoutProductInputObjectSchema as PurchaseRequestItemUpdateWithWhereUniqueWithoutProductInputObjectSchema } from './PurchaseRequestItemUpdateWithWhereUniqueWithoutProductInput.schema';
import { PurchaseRequestItemUpdateManyWithWhereWithoutProductInputObjectSchema as PurchaseRequestItemUpdateManyWithWhereWithoutProductInputObjectSchema } from './PurchaseRequestItemUpdateManyWithWhereWithoutProductInput.schema';
import { PurchaseRequestItemScalarWhereInputObjectSchema as PurchaseRequestItemScalarWhereInputObjectSchema } from './PurchaseRequestItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestItemCreateWithoutProductInputObjectSchema), z.lazy(() => PurchaseRequestItemCreateWithoutProductInputObjectSchema).array(), z.lazy(() => PurchaseRequestItemUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => PurchaseRequestItemUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PurchaseRequestItemCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => PurchaseRequestItemCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PurchaseRequestItemUpsertWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => PurchaseRequestItemUpsertWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PurchaseRequestItemCreateManyProductInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => PurchaseRequestItemUpdateWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => PurchaseRequestItemUpdateWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PurchaseRequestItemUpdateManyWithWhereWithoutProductInputObjectSchema), z.lazy(() => PurchaseRequestItemUpdateManyWithWhereWithoutProductInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PurchaseRequestItemScalarWhereInputObjectSchema), z.lazy(() => PurchaseRequestItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const PurchaseRequestItemUpdateManyWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemUpdateManyWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemUpdateManyWithoutProductNestedInput>;
export const PurchaseRequestItemUpdateManyWithoutProductNestedInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemCreateWithoutProductInputObjectSchema as PurchaseRequestItemCreateWithoutProductInputObjectSchema } from './PurchaseRequestItemCreateWithoutProductInput.schema';
import { PurchaseRequestItemUncheckedCreateWithoutProductInputObjectSchema as PurchaseRequestItemUncheckedCreateWithoutProductInputObjectSchema } from './PurchaseRequestItemUncheckedCreateWithoutProductInput.schema';
import { PurchaseRequestItemCreateOrConnectWithoutProductInputObjectSchema as PurchaseRequestItemCreateOrConnectWithoutProductInputObjectSchema } from './PurchaseRequestItemCreateOrConnectWithoutProductInput.schema';
import { PurchaseRequestItemCreateManyProductInputEnvelopeObjectSchema as PurchaseRequestItemCreateManyProductInputEnvelopeObjectSchema } from './PurchaseRequestItemCreateManyProductInputEnvelope.schema';
import { PurchaseRequestItemWhereUniqueInputObjectSchema as PurchaseRequestItemWhereUniqueInputObjectSchema } from './PurchaseRequestItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestItemCreateWithoutProductInputObjectSchema), z.lazy(() => PurchaseRequestItemCreateWithoutProductInputObjectSchema).array(), z.lazy(() => PurchaseRequestItemUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => PurchaseRequestItemUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PurchaseRequestItemCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => PurchaseRequestItemCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PurchaseRequestItemCreateManyProductInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const PurchaseRequestItemUncheckedCreateNestedManyWithoutProductInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemUncheckedCreateNestedManyWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemUncheckedCreateNestedManyWithoutProductInput>;
export const PurchaseRequestItemUncheckedCreateNestedManyWithoutProductInputObjectZodSchema = makeSchema();

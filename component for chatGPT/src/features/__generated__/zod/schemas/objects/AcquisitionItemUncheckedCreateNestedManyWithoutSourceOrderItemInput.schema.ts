import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateWithoutSourceOrderItemInputObjectSchema as AcquisitionItemCreateWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemCreateWithoutSourceOrderItemInput.schema';
import { AcquisitionItemUncheckedCreateWithoutSourceOrderItemInputObjectSchema as AcquisitionItemUncheckedCreateWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutSourceOrderItemInput.schema';
import { AcquisitionItemCreateOrConnectWithoutSourceOrderItemInputObjectSchema as AcquisitionItemCreateOrConnectWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemCreateOrConnectWithoutSourceOrderItemInput.schema';
import { AcquisitionItemCreateManySourceOrderItemInputEnvelopeObjectSchema as AcquisitionItemCreateManySourceOrderItemInputEnvelopeObjectSchema } from './AcquisitionItemCreateManySourceOrderItemInputEnvelope.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutSourceOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemCreateWithoutSourceOrderItemInputObjectSchema).array(), z.lazy(() => AcquisitionItemUncheckedCreateWithoutSourceOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutSourceOrderItemInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionItemCreateOrConnectWithoutSourceOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemCreateOrConnectWithoutSourceOrderItemInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionItemCreateManySourceOrderItemInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionItemUncheckedCreateNestedManyWithoutSourceOrderItemInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUncheckedCreateNestedManyWithoutSourceOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUncheckedCreateNestedManyWithoutSourceOrderItemInput>;
export const AcquisitionItemUncheckedCreateNestedManyWithoutSourceOrderItemInputObjectZodSchema = makeSchema();

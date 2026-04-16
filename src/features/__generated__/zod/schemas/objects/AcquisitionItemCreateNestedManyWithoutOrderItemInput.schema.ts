import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateWithoutOrderItemInputObjectSchema as AcquisitionItemCreateWithoutOrderItemInputObjectSchema } from './AcquisitionItemCreateWithoutOrderItemInput.schema';
import { AcquisitionItemUncheckedCreateWithoutOrderItemInputObjectSchema as AcquisitionItemUncheckedCreateWithoutOrderItemInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutOrderItemInput.schema';
import { AcquisitionItemCreateOrConnectWithoutOrderItemInputObjectSchema as AcquisitionItemCreateOrConnectWithoutOrderItemInputObjectSchema } from './AcquisitionItemCreateOrConnectWithoutOrderItemInput.schema';
import { AcquisitionItemCreateManyOrderItemInputEnvelopeObjectSchema as AcquisitionItemCreateManyOrderItemInputEnvelopeObjectSchema } from './AcquisitionItemCreateManyOrderItemInputEnvelope.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemCreateWithoutOrderItemInputObjectSchema).array(), z.lazy(() => AcquisitionItemUncheckedCreateWithoutOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutOrderItemInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionItemCreateOrConnectWithoutOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemCreateOrConnectWithoutOrderItemInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionItemCreateManyOrderItemInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionItemCreateNestedManyWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateNestedManyWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateNestedManyWithoutOrderItemInput>;
export const AcquisitionItemCreateNestedManyWithoutOrderItemInputObjectZodSchema = makeSchema();

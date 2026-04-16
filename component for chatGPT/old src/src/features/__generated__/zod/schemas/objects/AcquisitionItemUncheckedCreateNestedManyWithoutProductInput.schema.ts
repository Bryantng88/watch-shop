import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateWithoutProductInputObjectSchema as AcquisitionItemCreateWithoutProductInputObjectSchema } from './AcquisitionItemCreateWithoutProductInput.schema';
import { AcquisitionItemUncheckedCreateWithoutProductInputObjectSchema as AcquisitionItemUncheckedCreateWithoutProductInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutProductInput.schema';
import { AcquisitionItemCreateOrConnectWithoutProductInputObjectSchema as AcquisitionItemCreateOrConnectWithoutProductInputObjectSchema } from './AcquisitionItemCreateOrConnectWithoutProductInput.schema';
import { AcquisitionItemCreateManyProductInputEnvelopeObjectSchema as AcquisitionItemCreateManyProductInputEnvelopeObjectSchema } from './AcquisitionItemCreateManyProductInputEnvelope.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutProductInputObjectSchema), z.lazy(() => AcquisitionItemCreateWithoutProductInputObjectSchema).array(), z.lazy(() => AcquisitionItemUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionItemCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => AcquisitionItemCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionItemCreateManyProductInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionItemUncheckedCreateNestedManyWithoutProductInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUncheckedCreateNestedManyWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUncheckedCreateNestedManyWithoutProductInput>;
export const AcquisitionItemUncheckedCreateNestedManyWithoutProductInputObjectZodSchema = makeSchema();

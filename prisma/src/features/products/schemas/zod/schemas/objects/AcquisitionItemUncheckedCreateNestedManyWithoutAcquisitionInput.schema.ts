import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateWithoutAcquisitionInputObjectSchema as AcquisitionItemCreateWithoutAcquisitionInputObjectSchema } from './AcquisitionItemCreateWithoutAcquisitionInput.schema';
import { AcquisitionItemUncheckedCreateWithoutAcquisitionInputObjectSchema as AcquisitionItemUncheckedCreateWithoutAcquisitionInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutAcquisitionInput.schema';
import { AcquisitionItemCreateOrConnectWithoutAcquisitionInputObjectSchema as AcquisitionItemCreateOrConnectWithoutAcquisitionInputObjectSchema } from './AcquisitionItemCreateOrConnectWithoutAcquisitionInput.schema';
import { AcquisitionItemCreateManyAcquisitionInputEnvelopeObjectSchema as AcquisitionItemCreateManyAcquisitionInputEnvelopeObjectSchema } from './AcquisitionItemCreateManyAcquisitionInputEnvelope.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => AcquisitionItemCreateWithoutAcquisitionInputObjectSchema).array(), z.lazy(() => AcquisitionItemUncheckedCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutAcquisitionInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionItemCreateOrConnectWithoutAcquisitionInputObjectSchema), z.lazy(() => AcquisitionItemCreateOrConnectWithoutAcquisitionInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionItemCreateManyAcquisitionInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionItemUncheckedCreateNestedManyWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUncheckedCreateNestedManyWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUncheckedCreateNestedManyWithoutAcquisitionInput>;
export const AcquisitionItemUncheckedCreateNestedManyWithoutAcquisitionInputObjectZodSchema = makeSchema();

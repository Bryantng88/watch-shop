import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobCreateWithoutProductInputObjectSchema as AcquisitionSpecJobCreateWithoutProductInputObjectSchema } from './AcquisitionSpecJobCreateWithoutProductInput.schema';
import { AcquisitionSpecJobUncheckedCreateWithoutProductInputObjectSchema as AcquisitionSpecJobUncheckedCreateWithoutProductInputObjectSchema } from './AcquisitionSpecJobUncheckedCreateWithoutProductInput.schema';
import { AcquisitionSpecJobCreateOrConnectWithoutProductInputObjectSchema as AcquisitionSpecJobCreateOrConnectWithoutProductInputObjectSchema } from './AcquisitionSpecJobCreateOrConnectWithoutProductInput.schema';
import { AcquisitionSpecJobCreateManyProductInputEnvelopeObjectSchema as AcquisitionSpecJobCreateManyProductInputEnvelopeObjectSchema } from './AcquisitionSpecJobCreateManyProductInputEnvelope.schema';
import { AcquisitionSpecJobWhereUniqueInputObjectSchema as AcquisitionSpecJobWhereUniqueInputObjectSchema } from './AcquisitionSpecJobWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionSpecJobCreateWithoutProductInputObjectSchema), z.lazy(() => AcquisitionSpecJobCreateWithoutProductInputObjectSchema).array(), z.lazy(() => AcquisitionSpecJobUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionSpecJobCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => AcquisitionSpecJobCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionSpecJobCreateManyProductInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionSpecJobCreateNestedManyWithoutProductInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobCreateNestedManyWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobCreateNestedManyWithoutProductInput>;
export const AcquisitionSpecJobCreateNestedManyWithoutProductInputObjectZodSchema = makeSchema();

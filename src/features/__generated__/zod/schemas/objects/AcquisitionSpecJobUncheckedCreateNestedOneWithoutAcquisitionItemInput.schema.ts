import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobCreateWithoutAcquisitionItemInputObjectSchema as AcquisitionSpecJobCreateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionSpecJobCreateWithoutAcquisitionItemInput.schema';
import { AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInputObjectSchema as AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInput.schema';
import { AcquisitionSpecJobCreateOrConnectWithoutAcquisitionItemInputObjectSchema as AcquisitionSpecJobCreateOrConnectWithoutAcquisitionItemInputObjectSchema } from './AcquisitionSpecJobCreateOrConnectWithoutAcquisitionItemInput.schema';
import { AcquisitionSpecJobWhereUniqueInputObjectSchema as AcquisitionSpecJobWhereUniqueInputObjectSchema } from './AcquisitionSpecJobWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionSpecJobCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcquisitionSpecJobCreateOrConnectWithoutAcquisitionItemInputObjectSchema).optional(),
  connect: z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema).optional()
}).strict();
export const AcquisitionSpecJobUncheckedCreateNestedOneWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobUncheckedCreateNestedOneWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobUncheckedCreateNestedOneWithoutAcquisitionItemInput>;
export const AcquisitionSpecJobUncheckedCreateNestedOneWithoutAcquisitionItemInputObjectZodSchema = makeSchema();

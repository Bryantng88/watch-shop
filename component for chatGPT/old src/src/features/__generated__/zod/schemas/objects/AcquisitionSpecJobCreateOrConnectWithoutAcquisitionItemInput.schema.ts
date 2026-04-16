import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobWhereUniqueInputObjectSchema as AcquisitionSpecJobWhereUniqueInputObjectSchema } from './AcquisitionSpecJobWhereUniqueInput.schema';
import { AcquisitionSpecJobCreateWithoutAcquisitionItemInputObjectSchema as AcquisitionSpecJobCreateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionSpecJobCreateWithoutAcquisitionItemInput.schema';
import { AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInputObjectSchema as AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcquisitionSpecJobCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInputObjectSchema)])
}).strict();
export const AcquisitionSpecJobCreateOrConnectWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobCreateOrConnectWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobCreateOrConnectWithoutAcquisitionItemInput>;
export const AcquisitionSpecJobCreateOrConnectWithoutAcquisitionItemInputObjectZodSchema = makeSchema();

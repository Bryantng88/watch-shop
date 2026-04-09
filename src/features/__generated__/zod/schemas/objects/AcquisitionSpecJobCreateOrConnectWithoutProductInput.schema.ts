import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobWhereUniqueInputObjectSchema as AcquisitionSpecJobWhereUniqueInputObjectSchema } from './AcquisitionSpecJobWhereUniqueInput.schema';
import { AcquisitionSpecJobCreateWithoutProductInputObjectSchema as AcquisitionSpecJobCreateWithoutProductInputObjectSchema } from './AcquisitionSpecJobCreateWithoutProductInput.schema';
import { AcquisitionSpecJobUncheckedCreateWithoutProductInputObjectSchema as AcquisitionSpecJobUncheckedCreateWithoutProductInputObjectSchema } from './AcquisitionSpecJobUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcquisitionSpecJobCreateWithoutProductInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const AcquisitionSpecJobCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobCreateOrConnectWithoutProductInput>;
export const AcquisitionSpecJobCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();

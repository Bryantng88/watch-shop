import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobWhereUniqueInputObjectSchema as AcquisitionSpecJobWhereUniqueInputObjectSchema } from './AcquisitionSpecJobWhereUniqueInput.schema';
import { AcquisitionSpecJobCreateWithoutLogsInputObjectSchema as AcquisitionSpecJobCreateWithoutLogsInputObjectSchema } from './AcquisitionSpecJobCreateWithoutLogsInput.schema';
import { AcquisitionSpecJobUncheckedCreateWithoutLogsInputObjectSchema as AcquisitionSpecJobUncheckedCreateWithoutLogsInputObjectSchema } from './AcquisitionSpecJobUncheckedCreateWithoutLogsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcquisitionSpecJobCreateWithoutLogsInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedCreateWithoutLogsInputObjectSchema)])
}).strict();
export const AcquisitionSpecJobCreateOrConnectWithoutLogsInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobCreateOrConnectWithoutLogsInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobCreateOrConnectWithoutLogsInput>;
export const AcquisitionSpecJobCreateOrConnectWithoutLogsInputObjectZodSchema = makeSchema();

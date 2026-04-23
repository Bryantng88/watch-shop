import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobCreateWithoutLogsInputObjectSchema as AcquisitionSpecJobCreateWithoutLogsInputObjectSchema } from './AcquisitionSpecJobCreateWithoutLogsInput.schema';
import { AcquisitionSpecJobUncheckedCreateWithoutLogsInputObjectSchema as AcquisitionSpecJobUncheckedCreateWithoutLogsInputObjectSchema } from './AcquisitionSpecJobUncheckedCreateWithoutLogsInput.schema';
import { AcquisitionSpecJobCreateOrConnectWithoutLogsInputObjectSchema as AcquisitionSpecJobCreateOrConnectWithoutLogsInputObjectSchema } from './AcquisitionSpecJobCreateOrConnectWithoutLogsInput.schema';
import { AcquisitionSpecJobWhereUniqueInputObjectSchema as AcquisitionSpecJobWhereUniqueInputObjectSchema } from './AcquisitionSpecJobWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionSpecJobCreateWithoutLogsInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedCreateWithoutLogsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcquisitionSpecJobCreateOrConnectWithoutLogsInputObjectSchema).optional(),
  connect: z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema).optional()
}).strict();
export const AcquisitionSpecJobCreateNestedOneWithoutLogsInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobCreateNestedOneWithoutLogsInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobCreateNestedOneWithoutLogsInput>;
export const AcquisitionSpecJobCreateNestedOneWithoutLogsInputObjectZodSchema = makeSchema();

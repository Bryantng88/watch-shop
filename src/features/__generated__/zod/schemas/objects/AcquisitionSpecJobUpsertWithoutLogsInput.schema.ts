import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobUpdateWithoutLogsInputObjectSchema as AcquisitionSpecJobUpdateWithoutLogsInputObjectSchema } from './AcquisitionSpecJobUpdateWithoutLogsInput.schema';
import { AcquisitionSpecJobUncheckedUpdateWithoutLogsInputObjectSchema as AcquisitionSpecJobUncheckedUpdateWithoutLogsInputObjectSchema } from './AcquisitionSpecJobUncheckedUpdateWithoutLogsInput.schema';
import { AcquisitionSpecJobCreateWithoutLogsInputObjectSchema as AcquisitionSpecJobCreateWithoutLogsInputObjectSchema } from './AcquisitionSpecJobCreateWithoutLogsInput.schema';
import { AcquisitionSpecJobUncheckedCreateWithoutLogsInputObjectSchema as AcquisitionSpecJobUncheckedCreateWithoutLogsInputObjectSchema } from './AcquisitionSpecJobUncheckedCreateWithoutLogsInput.schema';
import { AcquisitionSpecJobWhereInputObjectSchema as AcquisitionSpecJobWhereInputObjectSchema } from './AcquisitionSpecJobWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => AcquisitionSpecJobUpdateWithoutLogsInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedUpdateWithoutLogsInputObjectSchema)]),
  create: z.union([z.lazy(() => AcquisitionSpecJobCreateWithoutLogsInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedCreateWithoutLogsInputObjectSchema)]),
  where: z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema).optional()
}).strict();
export const AcquisitionSpecJobUpsertWithoutLogsInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobUpsertWithoutLogsInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobUpsertWithoutLogsInput>;
export const AcquisitionSpecJobUpsertWithoutLogsInputObjectZodSchema = makeSchema();

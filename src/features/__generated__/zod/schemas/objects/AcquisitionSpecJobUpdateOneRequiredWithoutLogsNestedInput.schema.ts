import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobCreateWithoutLogsInputObjectSchema as AcquisitionSpecJobCreateWithoutLogsInputObjectSchema } from './AcquisitionSpecJobCreateWithoutLogsInput.schema';
import { AcquisitionSpecJobUncheckedCreateWithoutLogsInputObjectSchema as AcquisitionSpecJobUncheckedCreateWithoutLogsInputObjectSchema } from './AcquisitionSpecJobUncheckedCreateWithoutLogsInput.schema';
import { AcquisitionSpecJobCreateOrConnectWithoutLogsInputObjectSchema as AcquisitionSpecJobCreateOrConnectWithoutLogsInputObjectSchema } from './AcquisitionSpecJobCreateOrConnectWithoutLogsInput.schema';
import { AcquisitionSpecJobUpsertWithoutLogsInputObjectSchema as AcquisitionSpecJobUpsertWithoutLogsInputObjectSchema } from './AcquisitionSpecJobUpsertWithoutLogsInput.schema';
import { AcquisitionSpecJobWhereUniqueInputObjectSchema as AcquisitionSpecJobWhereUniqueInputObjectSchema } from './AcquisitionSpecJobWhereUniqueInput.schema';
import { AcquisitionSpecJobUpdateToOneWithWhereWithoutLogsInputObjectSchema as AcquisitionSpecJobUpdateToOneWithWhereWithoutLogsInputObjectSchema } from './AcquisitionSpecJobUpdateToOneWithWhereWithoutLogsInput.schema';
import { AcquisitionSpecJobUpdateWithoutLogsInputObjectSchema as AcquisitionSpecJobUpdateWithoutLogsInputObjectSchema } from './AcquisitionSpecJobUpdateWithoutLogsInput.schema';
import { AcquisitionSpecJobUncheckedUpdateWithoutLogsInputObjectSchema as AcquisitionSpecJobUncheckedUpdateWithoutLogsInputObjectSchema } from './AcquisitionSpecJobUncheckedUpdateWithoutLogsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionSpecJobCreateWithoutLogsInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedCreateWithoutLogsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcquisitionSpecJobCreateOrConnectWithoutLogsInputObjectSchema).optional(),
  upsert: z.lazy(() => AcquisitionSpecJobUpsertWithoutLogsInputObjectSchema).optional(),
  connect: z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AcquisitionSpecJobUpdateToOneWithWhereWithoutLogsInputObjectSchema), z.lazy(() => AcquisitionSpecJobUpdateWithoutLogsInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedUpdateWithoutLogsInputObjectSchema)]).optional()
}).strict();
export const AcquisitionSpecJobUpdateOneRequiredWithoutLogsNestedInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobUpdateOneRequiredWithoutLogsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobUpdateOneRequiredWithoutLogsNestedInput>;
export const AcquisitionSpecJobUpdateOneRequiredWithoutLogsNestedInputObjectZodSchema = makeSchema();

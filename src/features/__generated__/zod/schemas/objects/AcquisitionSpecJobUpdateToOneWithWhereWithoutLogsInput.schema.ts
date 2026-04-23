import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobWhereInputObjectSchema as AcquisitionSpecJobWhereInputObjectSchema } from './AcquisitionSpecJobWhereInput.schema';
import { AcquisitionSpecJobUpdateWithoutLogsInputObjectSchema as AcquisitionSpecJobUpdateWithoutLogsInputObjectSchema } from './AcquisitionSpecJobUpdateWithoutLogsInput.schema';
import { AcquisitionSpecJobUncheckedUpdateWithoutLogsInputObjectSchema as AcquisitionSpecJobUncheckedUpdateWithoutLogsInputObjectSchema } from './AcquisitionSpecJobUncheckedUpdateWithoutLogsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AcquisitionSpecJobUpdateWithoutLogsInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedUpdateWithoutLogsInputObjectSchema)])
}).strict();
export const AcquisitionSpecJobUpdateToOneWithWhereWithoutLogsInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobUpdateToOneWithWhereWithoutLogsInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobUpdateToOneWithWhereWithoutLogsInput>;
export const AcquisitionSpecJobUpdateToOneWithWhereWithoutLogsInputObjectZodSchema = makeSchema();

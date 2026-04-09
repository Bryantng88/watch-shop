import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobWhereInputObjectSchema as AcquisitionSpecJobWhereInputObjectSchema } from './AcquisitionSpecJobWhereInput.schema';
import { AcquisitionSpecJobUpdateWithoutAcquisitionItemInputObjectSchema as AcquisitionSpecJobUpdateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionSpecJobUpdateWithoutAcquisitionItemInput.schema';
import { AcquisitionSpecJobUncheckedUpdateWithoutAcquisitionItemInputObjectSchema as AcquisitionSpecJobUncheckedUpdateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionSpecJobUncheckedUpdateWithoutAcquisitionItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AcquisitionSpecJobUpdateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedUpdateWithoutAcquisitionItemInputObjectSchema)])
}).strict();
export const AcquisitionSpecJobUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobUpdateToOneWithWhereWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobUpdateToOneWithWhereWithoutAcquisitionItemInput>;
export const AcquisitionSpecJobUpdateToOneWithWhereWithoutAcquisitionItemInputObjectZodSchema = makeSchema();

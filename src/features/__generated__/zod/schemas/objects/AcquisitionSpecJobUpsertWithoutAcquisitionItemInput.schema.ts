import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobUpdateWithoutAcquisitionItemInputObjectSchema as AcquisitionSpecJobUpdateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionSpecJobUpdateWithoutAcquisitionItemInput.schema';
import { AcquisitionSpecJobUncheckedUpdateWithoutAcquisitionItemInputObjectSchema as AcquisitionSpecJobUncheckedUpdateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionSpecJobUncheckedUpdateWithoutAcquisitionItemInput.schema';
import { AcquisitionSpecJobCreateWithoutAcquisitionItemInputObjectSchema as AcquisitionSpecJobCreateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionSpecJobCreateWithoutAcquisitionItemInput.schema';
import { AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInputObjectSchema as AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInput.schema';
import { AcquisitionSpecJobWhereInputObjectSchema as AcquisitionSpecJobWhereInputObjectSchema } from './AcquisitionSpecJobWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => AcquisitionSpecJobUpdateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedUpdateWithoutAcquisitionItemInputObjectSchema)]),
  create: z.union([z.lazy(() => AcquisitionSpecJobCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInputObjectSchema)]),
  where: z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema).optional()
}).strict();
export const AcquisitionSpecJobUpsertWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobUpsertWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobUpsertWithoutAcquisitionItemInput>;
export const AcquisitionSpecJobUpsertWithoutAcquisitionItemInputObjectZodSchema = makeSchema();

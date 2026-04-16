import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemUpdateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemUpdateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemUpdateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionItemUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemUncheckedUpdateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionItemCreateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemCreateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemCreateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionItemUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionItemWhereInputObjectSchema as AcquisitionItemWhereInputObjectSchema } from './AcquisitionItemWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => AcquisitionItemUpdateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema)]),
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema)]),
  where: z.lazy(() => AcquisitionItemWhereInputObjectSchema).optional()
}).strict();
export const AcquisitionItemUpsertWithoutAcquisitionSpecJobInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpsertWithoutAcquisitionSpecJobInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpsertWithoutAcquisitionSpecJobInput>;
export const AcquisitionItemUpsertWithoutAcquisitionSpecJobInputObjectZodSchema = makeSchema();

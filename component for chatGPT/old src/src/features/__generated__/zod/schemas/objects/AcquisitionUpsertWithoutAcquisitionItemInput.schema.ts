import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionUpdateWithoutAcquisitionItemInputObjectSchema as AcquisitionUpdateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionUpdateWithoutAcquisitionItemInput.schema';
import { AcquisitionUncheckedUpdateWithoutAcquisitionItemInputObjectSchema as AcquisitionUncheckedUpdateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionUncheckedUpdateWithoutAcquisitionItemInput.schema';
import { AcquisitionCreateWithoutAcquisitionItemInputObjectSchema as AcquisitionCreateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionCreateWithoutAcquisitionItemInput.schema';
import { AcquisitionUncheckedCreateWithoutAcquisitionItemInputObjectSchema as AcquisitionUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionUncheckedCreateWithoutAcquisitionItemInput.schema';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './AcquisitionWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => AcquisitionUpdateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => AcquisitionUncheckedUpdateWithoutAcquisitionItemInputObjectSchema)]),
  create: z.union([z.lazy(() => AcquisitionCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutAcquisitionItemInputObjectSchema)]),
  where: z.lazy(() => AcquisitionWhereInputObjectSchema).optional()
}).strict();
export const AcquisitionUpsertWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.AcquisitionUpsertWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpsertWithoutAcquisitionItemInput>;
export const AcquisitionUpsertWithoutAcquisitionItemInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionUpdateWithoutTaskInputObjectSchema as AcquisitionUpdateWithoutTaskInputObjectSchema } from './AcquisitionUpdateWithoutTaskInput.schema';
import { AcquisitionUncheckedUpdateWithoutTaskInputObjectSchema as AcquisitionUncheckedUpdateWithoutTaskInputObjectSchema } from './AcquisitionUncheckedUpdateWithoutTaskInput.schema';
import { AcquisitionCreateWithoutTaskInputObjectSchema as AcquisitionCreateWithoutTaskInputObjectSchema } from './AcquisitionCreateWithoutTaskInput.schema';
import { AcquisitionUncheckedCreateWithoutTaskInputObjectSchema as AcquisitionUncheckedCreateWithoutTaskInputObjectSchema } from './AcquisitionUncheckedCreateWithoutTaskInput.schema';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './AcquisitionWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => AcquisitionUpdateWithoutTaskInputObjectSchema), z.lazy(() => AcquisitionUncheckedUpdateWithoutTaskInputObjectSchema)]),
  create: z.union([z.lazy(() => AcquisitionCreateWithoutTaskInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutTaskInputObjectSchema)]),
  where: z.lazy(() => AcquisitionWhereInputObjectSchema).optional()
}).strict();
export const AcquisitionUpsertWithoutTaskInputObjectSchema: z.ZodType<Prisma.AcquisitionUpsertWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpsertWithoutTaskInput>;
export const AcquisitionUpsertWithoutTaskInputObjectZodSchema = makeSchema();

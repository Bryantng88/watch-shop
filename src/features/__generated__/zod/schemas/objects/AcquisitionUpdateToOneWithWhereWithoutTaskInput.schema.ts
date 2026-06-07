import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './AcquisitionWhereInput.schema';
import { AcquisitionUpdateWithoutTaskInputObjectSchema as AcquisitionUpdateWithoutTaskInputObjectSchema } from './AcquisitionUpdateWithoutTaskInput.schema';
import { AcquisitionUncheckedUpdateWithoutTaskInputObjectSchema as AcquisitionUncheckedUpdateWithoutTaskInputObjectSchema } from './AcquisitionUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AcquisitionUpdateWithoutTaskInputObjectSchema), z.lazy(() => AcquisitionUncheckedUpdateWithoutTaskInputObjectSchema)])
}).strict();
export const AcquisitionUpdateToOneWithWhereWithoutTaskInputObjectSchema: z.ZodType<Prisma.AcquisitionUpdateToOneWithWhereWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpdateToOneWithWhereWithoutTaskInput>;
export const AcquisitionUpdateToOneWithWhereWithoutTaskInputObjectZodSchema = makeSchema();

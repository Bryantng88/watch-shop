import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './AcquisitionWhereInput.schema';
import { AcquisitionUpdateWithoutAcquisitionItemInputObjectSchema as AcquisitionUpdateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionUpdateWithoutAcquisitionItemInput.schema';
import { AcquisitionUncheckedUpdateWithoutAcquisitionItemInputObjectSchema as AcquisitionUncheckedUpdateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionUncheckedUpdateWithoutAcquisitionItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AcquisitionUpdateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => AcquisitionUncheckedUpdateWithoutAcquisitionItemInputObjectSchema)])
}).strict();
export const AcquisitionUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.AcquisitionUpdateToOneWithWhereWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpdateToOneWithWhereWithoutAcquisitionItemInput>;
export const AcquisitionUpdateToOneWithWhereWithoutAcquisitionItemInputObjectZodSchema = makeSchema();

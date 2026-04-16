import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereInputObjectSchema as AcquisitionItemWhereInputObjectSchema } from './AcquisitionItemWhereInput.schema';
import { AcquisitionItemUpdateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemUpdateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemUpdateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionItemUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemUncheckedUpdateWithoutAcquisitionSpecJobInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AcquisitionItemUpdateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema)])
}).strict();
export const AcquisitionItemUpdateToOneWithWhereWithoutAcquisitionSpecJobInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateToOneWithWhereWithoutAcquisitionSpecJobInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateToOneWithWhereWithoutAcquisitionSpecJobInput>;
export const AcquisitionItemUpdateToOneWithWhereWithoutAcquisitionSpecJobInputObjectZodSchema = makeSchema();

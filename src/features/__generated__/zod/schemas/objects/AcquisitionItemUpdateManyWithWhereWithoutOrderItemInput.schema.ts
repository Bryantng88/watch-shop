import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemScalarWhereInputObjectSchema as AcquisitionItemScalarWhereInputObjectSchema } from './AcquisitionItemScalarWhereInput.schema';
import { AcquisitionItemUpdateManyMutationInputObjectSchema as AcquisitionItemUpdateManyMutationInputObjectSchema } from './AcquisitionItemUpdateManyMutationInput.schema';
import { AcquisitionItemUncheckedUpdateManyWithoutOrderItemInputObjectSchema as AcquisitionItemUncheckedUpdateManyWithoutOrderItemInputObjectSchema } from './AcquisitionItemUncheckedUpdateManyWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionItemUpdateManyMutationInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateManyWithoutOrderItemInputObjectSchema)])
}).strict();
export const AcquisitionItemUpdateManyWithWhereWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateManyWithWhereWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateManyWithWhereWithoutOrderItemInput>;
export const AcquisitionItemUpdateManyWithWhereWithoutOrderItemInputObjectZodSchema = makeSchema();

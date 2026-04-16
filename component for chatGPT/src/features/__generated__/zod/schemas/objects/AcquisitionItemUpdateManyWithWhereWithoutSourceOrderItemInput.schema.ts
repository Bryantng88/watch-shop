import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemScalarWhereInputObjectSchema as AcquisitionItemScalarWhereInputObjectSchema } from './AcquisitionItemScalarWhereInput.schema';
import { AcquisitionItemUpdateManyMutationInputObjectSchema as AcquisitionItemUpdateManyMutationInputObjectSchema } from './AcquisitionItemUpdateManyMutationInput.schema';
import { AcquisitionItemUncheckedUpdateManyWithoutSourceOrderItemInputObjectSchema as AcquisitionItemUncheckedUpdateManyWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemUncheckedUpdateManyWithoutSourceOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionItemUpdateManyMutationInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateManyWithoutSourceOrderItemInputObjectSchema)])
}).strict();
export const AcquisitionItemUpdateManyWithWhereWithoutSourceOrderItemInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateManyWithWhereWithoutSourceOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateManyWithWhereWithoutSourceOrderItemInput>;
export const AcquisitionItemUpdateManyWithWhereWithoutSourceOrderItemInputObjectZodSchema = makeSchema();

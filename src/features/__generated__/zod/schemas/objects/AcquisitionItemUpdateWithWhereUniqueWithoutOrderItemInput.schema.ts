import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateWithoutOrderItemInputObjectSchema as AcquisitionItemUpdateWithoutOrderItemInputObjectSchema } from './AcquisitionItemUpdateWithoutOrderItemInput.schema';
import { AcquisitionItemUncheckedUpdateWithoutOrderItemInputObjectSchema as AcquisitionItemUncheckedUpdateWithoutOrderItemInputObjectSchema } from './AcquisitionItemUncheckedUpdateWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionItemUpdateWithoutOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateWithoutOrderItemInputObjectSchema)])
}).strict();
export const AcquisitionItemUpdateWithWhereUniqueWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateWithWhereUniqueWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateWithWhereUniqueWithoutOrderItemInput>;
export const AcquisitionItemUpdateWithWhereUniqueWithoutOrderItemInputObjectZodSchema = makeSchema();

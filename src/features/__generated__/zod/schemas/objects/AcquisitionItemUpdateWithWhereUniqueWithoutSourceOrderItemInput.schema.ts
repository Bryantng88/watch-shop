import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateWithoutSourceOrderItemInputObjectSchema as AcquisitionItemUpdateWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemUpdateWithoutSourceOrderItemInput.schema';
import { AcquisitionItemUncheckedUpdateWithoutSourceOrderItemInputObjectSchema as AcquisitionItemUncheckedUpdateWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemUncheckedUpdateWithoutSourceOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionItemUpdateWithoutSourceOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateWithoutSourceOrderItemInputObjectSchema)])
}).strict();
export const AcquisitionItemUpdateWithWhereUniqueWithoutSourceOrderItemInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateWithWhereUniqueWithoutSourceOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateWithWhereUniqueWithoutSourceOrderItemInput>;
export const AcquisitionItemUpdateWithWhereUniqueWithoutSourceOrderItemInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateWithoutSourceOrderItemInputObjectSchema as AcquisitionItemUpdateWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemUpdateWithoutSourceOrderItemInput.schema';
import { AcquisitionItemUncheckedUpdateWithoutSourceOrderItemInputObjectSchema as AcquisitionItemUncheckedUpdateWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemUncheckedUpdateWithoutSourceOrderItemInput.schema';
import { AcquisitionItemCreateWithoutSourceOrderItemInputObjectSchema as AcquisitionItemCreateWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemCreateWithoutSourceOrderItemInput.schema';
import { AcquisitionItemUncheckedCreateWithoutSourceOrderItemInputObjectSchema as AcquisitionItemUncheckedCreateWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutSourceOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AcquisitionItemUpdateWithoutSourceOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateWithoutSourceOrderItemInputObjectSchema)]),
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutSourceOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutSourceOrderItemInputObjectSchema)])
}).strict();
export const AcquisitionItemUpsertWithWhereUniqueWithoutSourceOrderItemInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpsertWithWhereUniqueWithoutSourceOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpsertWithWhereUniqueWithoutSourceOrderItemInput>;
export const AcquisitionItemUpsertWithWhereUniqueWithoutSourceOrderItemInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateWithoutOrderItemInputObjectSchema as AcquisitionItemUpdateWithoutOrderItemInputObjectSchema } from './AcquisitionItemUpdateWithoutOrderItemInput.schema';
import { AcquisitionItemUncheckedUpdateWithoutOrderItemInputObjectSchema as AcquisitionItemUncheckedUpdateWithoutOrderItemInputObjectSchema } from './AcquisitionItemUncheckedUpdateWithoutOrderItemInput.schema';
import { AcquisitionItemCreateWithoutOrderItemInputObjectSchema as AcquisitionItemCreateWithoutOrderItemInputObjectSchema } from './AcquisitionItemCreateWithoutOrderItemInput.schema';
import { AcquisitionItemUncheckedCreateWithoutOrderItemInputObjectSchema as AcquisitionItemUncheckedCreateWithoutOrderItemInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AcquisitionItemUpdateWithoutOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateWithoutOrderItemInputObjectSchema)]),
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutOrderItemInputObjectSchema)])
}).strict();
export const AcquisitionItemUpsertWithWhereUniqueWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpsertWithWhereUniqueWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpsertWithWhereUniqueWithoutOrderItemInput>;
export const AcquisitionItemUpsertWithWhereUniqueWithoutOrderItemInputObjectZodSchema = makeSchema();

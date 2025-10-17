import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateWithoutProductInputObjectSchema as AcquisitionItemUpdateWithoutProductInputObjectSchema } from './AcquisitionItemUpdateWithoutProductInput.schema';
import { AcquisitionItemUncheckedUpdateWithoutProductInputObjectSchema as AcquisitionItemUncheckedUpdateWithoutProductInputObjectSchema } from './AcquisitionItemUncheckedUpdateWithoutProductInput.schema';
import { AcquisitionItemCreateWithoutProductInputObjectSchema as AcquisitionItemCreateWithoutProductInputObjectSchema } from './AcquisitionItemCreateWithoutProductInput.schema';
import { AcquisitionItemUncheckedCreateWithoutProductInputObjectSchema as AcquisitionItemUncheckedCreateWithoutProductInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AcquisitionItemUpdateWithoutProductInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutProductInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const AcquisitionItemUpsertWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpsertWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpsertWithWhereUniqueWithoutProductInput>;
export const AcquisitionItemUpsertWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();

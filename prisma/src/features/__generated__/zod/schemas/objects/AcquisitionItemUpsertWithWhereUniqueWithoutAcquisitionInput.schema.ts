import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateWithoutAcquisitionInputObjectSchema as AcquisitionItemUpdateWithoutAcquisitionInputObjectSchema } from './AcquisitionItemUpdateWithoutAcquisitionInput.schema';
import { AcquisitionItemUncheckedUpdateWithoutAcquisitionInputObjectSchema as AcquisitionItemUncheckedUpdateWithoutAcquisitionInputObjectSchema } from './AcquisitionItemUncheckedUpdateWithoutAcquisitionInput.schema';
import { AcquisitionItemCreateWithoutAcquisitionInputObjectSchema as AcquisitionItemCreateWithoutAcquisitionInputObjectSchema } from './AcquisitionItemCreateWithoutAcquisitionInput.schema';
import { AcquisitionItemUncheckedCreateWithoutAcquisitionInputObjectSchema as AcquisitionItemUncheckedCreateWithoutAcquisitionInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AcquisitionItemUpdateWithoutAcquisitionInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateWithoutAcquisitionInputObjectSchema)]),
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutAcquisitionInputObjectSchema)])
}).strict();
export const AcquisitionItemUpsertWithWhereUniqueWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpsertWithWhereUniqueWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpsertWithWhereUniqueWithoutAcquisitionInput>;
export const AcquisitionItemUpsertWithWhereUniqueWithoutAcquisitionInputObjectZodSchema = makeSchema();

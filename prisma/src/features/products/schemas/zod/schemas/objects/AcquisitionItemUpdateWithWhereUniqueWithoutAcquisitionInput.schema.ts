import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateWithoutAcquisitionInputObjectSchema as AcquisitionItemUpdateWithoutAcquisitionInputObjectSchema } from './AcquisitionItemUpdateWithoutAcquisitionInput.schema';
import { AcquisitionItemUncheckedUpdateWithoutAcquisitionInputObjectSchema as AcquisitionItemUncheckedUpdateWithoutAcquisitionInputObjectSchema } from './AcquisitionItemUncheckedUpdateWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionItemUpdateWithoutAcquisitionInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateWithoutAcquisitionInputObjectSchema)])
}).strict();
export const AcquisitionItemUpdateWithWhereUniqueWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateWithWhereUniqueWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateWithWhereUniqueWithoutAcquisitionInput>;
export const AcquisitionItemUpdateWithWhereUniqueWithoutAcquisitionInputObjectZodSchema = makeSchema();

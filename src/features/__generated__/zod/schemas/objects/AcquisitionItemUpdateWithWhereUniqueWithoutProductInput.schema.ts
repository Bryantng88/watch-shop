import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateWithoutProductInputObjectSchema as AcquisitionItemUpdateWithoutProductInputObjectSchema } from './AcquisitionItemUpdateWithoutProductInput.schema';
import { AcquisitionItemUncheckedUpdateWithoutProductInputObjectSchema as AcquisitionItemUncheckedUpdateWithoutProductInputObjectSchema } from './AcquisitionItemUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionItemUpdateWithoutProductInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const AcquisitionItemUpdateWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateWithWhereUniqueWithoutProductInput>;
export const AcquisitionItemUpdateWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();

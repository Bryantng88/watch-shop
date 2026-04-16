import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateWithoutVariantInputObjectSchema as AcquisitionItemUpdateWithoutVariantInputObjectSchema } from './AcquisitionItemUpdateWithoutVariantInput.schema';
import { AcquisitionItemUncheckedUpdateWithoutVariantInputObjectSchema as AcquisitionItemUncheckedUpdateWithoutVariantInputObjectSchema } from './AcquisitionItemUncheckedUpdateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionItemUpdateWithoutVariantInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateWithoutVariantInputObjectSchema)])
}).strict();
export const AcquisitionItemUpdateWithWhereUniqueWithoutVariantInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateWithWhereUniqueWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateWithWhereUniqueWithoutVariantInput>;
export const AcquisitionItemUpdateWithWhereUniqueWithoutVariantInputObjectZodSchema = makeSchema();

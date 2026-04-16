import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateWithoutProductVariantInputObjectSchema as AcquisitionItemUpdateWithoutProductVariantInputObjectSchema } from './AcquisitionItemUpdateWithoutProductVariantInput.schema';
import { AcquisitionItemUncheckedUpdateWithoutProductVariantInputObjectSchema as AcquisitionItemUncheckedUpdateWithoutProductVariantInputObjectSchema } from './AcquisitionItemUncheckedUpdateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionItemUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateWithoutProductVariantInputObjectSchema)])
}).strict();
export const AcquisitionItemUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateWithWhereUniqueWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateWithWhereUniqueWithoutProductVariantInput>;
export const AcquisitionItemUpdateWithWhereUniqueWithoutProductVariantInputObjectZodSchema = makeSchema();

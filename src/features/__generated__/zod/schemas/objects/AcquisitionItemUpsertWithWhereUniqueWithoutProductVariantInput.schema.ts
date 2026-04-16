import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateWithoutProductVariantInputObjectSchema as AcquisitionItemUpdateWithoutProductVariantInputObjectSchema } from './AcquisitionItemUpdateWithoutProductVariantInput.schema';
import { AcquisitionItemUncheckedUpdateWithoutProductVariantInputObjectSchema as AcquisitionItemUncheckedUpdateWithoutProductVariantInputObjectSchema } from './AcquisitionItemUncheckedUpdateWithoutProductVariantInput.schema';
import { AcquisitionItemCreateWithoutProductVariantInputObjectSchema as AcquisitionItemCreateWithoutProductVariantInputObjectSchema } from './AcquisitionItemCreateWithoutProductVariantInput.schema';
import { AcquisitionItemUncheckedCreateWithoutProductVariantInputObjectSchema as AcquisitionItemUncheckedCreateWithoutProductVariantInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AcquisitionItemUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateWithoutProductVariantInputObjectSchema)]),
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutProductVariantInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutProductVariantInputObjectSchema)])
}).strict();
export const AcquisitionItemUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpsertWithWhereUniqueWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpsertWithWhereUniqueWithoutProductVariantInput>;
export const AcquisitionItemUpsertWithWhereUniqueWithoutProductVariantInputObjectZodSchema = makeSchema();

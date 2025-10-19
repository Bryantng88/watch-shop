import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateWithoutVariantInputObjectSchema as AcquisitionItemUpdateWithoutVariantInputObjectSchema } from './AcquisitionItemUpdateWithoutVariantInput.schema';
import { AcquisitionItemUncheckedUpdateWithoutVariantInputObjectSchema as AcquisitionItemUncheckedUpdateWithoutVariantInputObjectSchema } from './AcquisitionItemUncheckedUpdateWithoutVariantInput.schema';
import { AcquisitionItemCreateWithoutVariantInputObjectSchema as AcquisitionItemCreateWithoutVariantInputObjectSchema } from './AcquisitionItemCreateWithoutVariantInput.schema';
import { AcquisitionItemUncheckedCreateWithoutVariantInputObjectSchema as AcquisitionItemUncheckedCreateWithoutVariantInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AcquisitionItemUpdateWithoutVariantInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateWithoutVariantInputObjectSchema)]),
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutVariantInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutVariantInputObjectSchema)])
}).strict();
export const AcquisitionItemUpsertWithWhereUniqueWithoutVariantInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpsertWithWhereUniqueWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpsertWithWhereUniqueWithoutVariantInput>;
export const AcquisitionItemUpsertWithWhereUniqueWithoutVariantInputObjectZodSchema = makeSchema();

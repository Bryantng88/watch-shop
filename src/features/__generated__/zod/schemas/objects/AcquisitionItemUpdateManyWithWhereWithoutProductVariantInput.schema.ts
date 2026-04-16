import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemScalarWhereInputObjectSchema as AcquisitionItemScalarWhereInputObjectSchema } from './AcquisitionItemScalarWhereInput.schema';
import { AcquisitionItemUpdateManyMutationInputObjectSchema as AcquisitionItemUpdateManyMutationInputObjectSchema } from './AcquisitionItemUpdateManyMutationInput.schema';
import { AcquisitionItemUncheckedUpdateManyWithoutProductVariantInputObjectSchema as AcquisitionItemUncheckedUpdateManyWithoutProductVariantInputObjectSchema } from './AcquisitionItemUncheckedUpdateManyWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionItemUpdateManyMutationInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateManyWithoutProductVariantInputObjectSchema)])
}).strict();
export const AcquisitionItemUpdateManyWithWhereWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateManyWithWhereWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateManyWithWhereWithoutProductVariantInput>;
export const AcquisitionItemUpdateManyWithWhereWithoutProductVariantInputObjectZodSchema = makeSchema();

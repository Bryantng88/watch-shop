import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemScalarWhereInputObjectSchema as AcquisitionItemScalarWhereInputObjectSchema } from './AcquisitionItemScalarWhereInput.schema';
import { AcquisitionItemUpdateManyMutationInputObjectSchema as AcquisitionItemUpdateManyMutationInputObjectSchema } from './AcquisitionItemUpdateManyMutationInput.schema';
import { AcquisitionItemUncheckedUpdateManyWithoutVariantInputObjectSchema as AcquisitionItemUncheckedUpdateManyWithoutVariantInputObjectSchema } from './AcquisitionItemUncheckedUpdateManyWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionItemUpdateManyMutationInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateManyWithoutVariantInputObjectSchema)])
}).strict();
export const AcquisitionItemUpdateManyWithWhereWithoutVariantInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateManyWithWhereWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateManyWithWhereWithoutVariantInput>;
export const AcquisitionItemUpdateManyWithWhereWithoutVariantInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemScalarWhereInputObjectSchema as AcquisitionItemScalarWhereInputObjectSchema } from './AcquisitionItemScalarWhereInput.schema';
import { AcquisitionItemUpdateManyMutationInputObjectSchema as AcquisitionItemUpdateManyMutationInputObjectSchema } from './AcquisitionItemUpdateManyMutationInput.schema';
import { AcquisitionItemUncheckedUpdateManyWithoutAcquisitionInputObjectSchema as AcquisitionItemUncheckedUpdateManyWithoutAcquisitionInputObjectSchema } from './AcquisitionItemUncheckedUpdateManyWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionItemUpdateManyMutationInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateManyWithoutAcquisitionInputObjectSchema)])
}).strict();
export const AcquisitionItemUpdateManyWithWhereWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateManyWithWhereWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateManyWithWhereWithoutAcquisitionInput>;
export const AcquisitionItemUpdateManyWithWhereWithoutAcquisitionInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemScalarWhereInputObjectSchema as AcquisitionItemScalarWhereInputObjectSchema } from './AcquisitionItemScalarWhereInput.schema';
import { AcquisitionItemUpdateManyMutationInputObjectSchema as AcquisitionItemUpdateManyMutationInputObjectSchema } from './AcquisitionItemUpdateManyMutationInput.schema';
import { AcquisitionItemUncheckedUpdateManyWithoutProductInputObjectSchema as AcquisitionItemUncheckedUpdateManyWithoutProductInputObjectSchema } from './AcquisitionItemUncheckedUpdateManyWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionItemUpdateManyMutationInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateManyWithoutProductInputObjectSchema)])
}).strict();
export const AcquisitionItemUpdateManyWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateManyWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateManyWithWhereWithoutProductInput>;
export const AcquisitionItemUpdateManyWithWhereWithoutProductInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionScalarWhereInputObjectSchema as AcquisitionScalarWhereInputObjectSchema } from './AcquisitionScalarWhereInput.schema';
import { AcquisitionUpdateManyMutationInputObjectSchema as AcquisitionUpdateManyMutationInputObjectSchema } from './AcquisitionUpdateManyMutationInput.schema';
import { AcquisitionUncheckedUpdateManyWithoutSourceOrderInputObjectSchema as AcquisitionUncheckedUpdateManyWithoutSourceOrderInputObjectSchema } from './AcquisitionUncheckedUpdateManyWithoutSourceOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionUpdateManyMutationInputObjectSchema), z.lazy(() => AcquisitionUncheckedUpdateManyWithoutSourceOrderInputObjectSchema)])
}).strict();
export const AcquisitionUpdateManyWithWhereWithoutSourceOrderInputObjectSchema: z.ZodType<Prisma.AcquisitionUpdateManyWithWhereWithoutSourceOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpdateManyWithWhereWithoutSourceOrderInput>;
export const AcquisitionUpdateManyWithWhereWithoutSourceOrderInputObjectZodSchema = makeSchema();

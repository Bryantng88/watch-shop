import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionScalarWhereInputObjectSchema as AcquisitionScalarWhereInputObjectSchema } from './AcquisitionScalarWhereInput.schema';
import { AcquisitionUpdateManyMutationInputObjectSchema as AcquisitionUpdateManyMutationInputObjectSchema } from './AcquisitionUpdateManyMutationInput.schema';
import { AcquisitionUncheckedUpdateManyWithoutCustomerInputObjectSchema as AcquisitionUncheckedUpdateManyWithoutCustomerInputObjectSchema } from './AcquisitionUncheckedUpdateManyWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionUpdateManyMutationInputObjectSchema), z.lazy(() => AcquisitionUncheckedUpdateManyWithoutCustomerInputObjectSchema)])
}).strict();
export const AcquisitionUpdateManyWithWhereWithoutCustomerInputObjectSchema: z.ZodType<Prisma.AcquisitionUpdateManyWithWhereWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpdateManyWithWhereWithoutCustomerInput>;
export const AcquisitionUpdateManyWithWhereWithoutCustomerInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema';
import { AcquisitionUpdateWithoutCustomerInputObjectSchema as AcquisitionUpdateWithoutCustomerInputObjectSchema } from './AcquisitionUpdateWithoutCustomerInput.schema';
import { AcquisitionUncheckedUpdateWithoutCustomerInputObjectSchema as AcquisitionUncheckedUpdateWithoutCustomerInputObjectSchema } from './AcquisitionUncheckedUpdateWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionUpdateWithoutCustomerInputObjectSchema), z.lazy(() => AcquisitionUncheckedUpdateWithoutCustomerInputObjectSchema)])
}).strict();
export const AcquisitionUpdateWithWhereUniqueWithoutCustomerInputObjectSchema: z.ZodType<Prisma.AcquisitionUpdateWithWhereUniqueWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpdateWithWhereUniqueWithoutCustomerInput>;
export const AcquisitionUpdateWithWhereUniqueWithoutCustomerInputObjectZodSchema = makeSchema();

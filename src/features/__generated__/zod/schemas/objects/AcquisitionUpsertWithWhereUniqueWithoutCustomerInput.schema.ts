import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema';
import { AcquisitionUpdateWithoutCustomerInputObjectSchema as AcquisitionUpdateWithoutCustomerInputObjectSchema } from './AcquisitionUpdateWithoutCustomerInput.schema';
import { AcquisitionUncheckedUpdateWithoutCustomerInputObjectSchema as AcquisitionUncheckedUpdateWithoutCustomerInputObjectSchema } from './AcquisitionUncheckedUpdateWithoutCustomerInput.schema';
import { AcquisitionCreateWithoutCustomerInputObjectSchema as AcquisitionCreateWithoutCustomerInputObjectSchema } from './AcquisitionCreateWithoutCustomerInput.schema';
import { AcquisitionUncheckedCreateWithoutCustomerInputObjectSchema as AcquisitionUncheckedCreateWithoutCustomerInputObjectSchema } from './AcquisitionUncheckedCreateWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AcquisitionUpdateWithoutCustomerInputObjectSchema), z.lazy(() => AcquisitionUncheckedUpdateWithoutCustomerInputObjectSchema)]),
  create: z.union([z.lazy(() => AcquisitionCreateWithoutCustomerInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutCustomerInputObjectSchema)])
}).strict();
export const AcquisitionUpsertWithWhereUniqueWithoutCustomerInputObjectSchema: z.ZodType<Prisma.AcquisitionUpsertWithWhereUniqueWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpsertWithWhereUniqueWithoutCustomerInput>;
export const AcquisitionUpsertWithWhereUniqueWithoutCustomerInputObjectZodSchema = makeSchema();

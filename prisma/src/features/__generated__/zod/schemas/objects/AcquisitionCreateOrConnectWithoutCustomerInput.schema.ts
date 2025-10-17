import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema';
import { AcquisitionCreateWithoutCustomerInputObjectSchema as AcquisitionCreateWithoutCustomerInputObjectSchema } from './AcquisitionCreateWithoutCustomerInput.schema';
import { AcquisitionUncheckedCreateWithoutCustomerInputObjectSchema as AcquisitionUncheckedCreateWithoutCustomerInputObjectSchema } from './AcquisitionUncheckedCreateWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcquisitionCreateWithoutCustomerInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutCustomerInputObjectSchema)])
}).strict();
export const AcquisitionCreateOrConnectWithoutCustomerInputObjectSchema: z.ZodType<Prisma.AcquisitionCreateOrConnectWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCreateOrConnectWithoutCustomerInput>;
export const AcquisitionCreateOrConnectWithoutCustomerInputObjectZodSchema = makeSchema();

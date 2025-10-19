import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateWithoutCustomerInputObjectSchema as AcquisitionCreateWithoutCustomerInputObjectSchema } from './AcquisitionCreateWithoutCustomerInput.schema';
import { AcquisitionUncheckedCreateWithoutCustomerInputObjectSchema as AcquisitionUncheckedCreateWithoutCustomerInputObjectSchema } from './AcquisitionUncheckedCreateWithoutCustomerInput.schema';
import { AcquisitionCreateOrConnectWithoutCustomerInputObjectSchema as AcquisitionCreateOrConnectWithoutCustomerInputObjectSchema } from './AcquisitionCreateOrConnectWithoutCustomerInput.schema';
import { AcquisitionCreateManyCustomerInputEnvelopeObjectSchema as AcquisitionCreateManyCustomerInputEnvelopeObjectSchema } from './AcquisitionCreateManyCustomerInputEnvelope.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionCreateWithoutCustomerInputObjectSchema), z.lazy(() => AcquisitionCreateWithoutCustomerInputObjectSchema).array(), z.lazy(() => AcquisitionUncheckedCreateWithoutCustomerInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutCustomerInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionCreateOrConnectWithoutCustomerInputObjectSchema), z.lazy(() => AcquisitionCreateOrConnectWithoutCustomerInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionCreateManyCustomerInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AcquisitionWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionUncheckedCreateNestedManyWithoutCustomerInputObjectSchema: z.ZodType<Prisma.AcquisitionUncheckedCreateNestedManyWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUncheckedCreateNestedManyWithoutCustomerInput>;
export const AcquisitionUncheckedCreateNestedManyWithoutCustomerInputObjectZodSchema = makeSchema();

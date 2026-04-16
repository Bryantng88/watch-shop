import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutCustomerInputObjectSchema as ServiceRequestCreateWithoutCustomerInputObjectSchema } from './ServiceRequestCreateWithoutCustomerInput.schema';
import { ServiceRequestUncheckedCreateWithoutCustomerInputObjectSchema as ServiceRequestUncheckedCreateWithoutCustomerInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutCustomerInput.schema';
import { ServiceRequestCreateOrConnectWithoutCustomerInputObjectSchema as ServiceRequestCreateOrConnectWithoutCustomerInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutCustomerInput.schema';
import { ServiceRequestCreateManyCustomerInputEnvelopeObjectSchema as ServiceRequestCreateManyCustomerInputEnvelopeObjectSchema } from './ServiceRequestCreateManyCustomerInputEnvelope.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutCustomerInputObjectSchema), z.lazy(() => ServiceRequestCreateWithoutCustomerInputObjectSchema).array(), z.lazy(() => ServiceRequestUncheckedCreateWithoutCustomerInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutCustomerInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceRequestCreateOrConnectWithoutCustomerInputObjectSchema), z.lazy(() => ServiceRequestCreateOrConnectWithoutCustomerInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceRequestCreateManyCustomerInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ServiceRequestCreateNestedManyWithoutCustomerInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateNestedManyWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateNestedManyWithoutCustomerInput>;
export const ServiceRequestCreateNestedManyWithoutCustomerInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestCreateWithoutCustomerInputObjectSchema as ServiceRequestCreateWithoutCustomerInputObjectSchema } from './ServiceRequestCreateWithoutCustomerInput.schema';
import { ServiceRequestUncheckedCreateWithoutCustomerInputObjectSchema as ServiceRequestUncheckedCreateWithoutCustomerInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutCustomerInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutCustomerInputObjectSchema)])
}).strict();
export const ServiceRequestCreateOrConnectWithoutCustomerInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutCustomerInput>;
export const ServiceRequestCreateOrConnectWithoutCustomerInputObjectZodSchema = makeSchema();

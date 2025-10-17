import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithoutCustomerInputObjectSchema as ServiceRequestUpdateWithoutCustomerInputObjectSchema } from './ServiceRequestUpdateWithoutCustomerInput.schema';
import { ServiceRequestUncheckedUpdateWithoutCustomerInputObjectSchema as ServiceRequestUncheckedUpdateWithoutCustomerInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ServiceRequestUpdateWithoutCustomerInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutCustomerInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateWithWhereUniqueWithoutCustomerInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateWithWhereUniqueWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateWithWhereUniqueWithoutCustomerInput>;
export const ServiceRequestUpdateWithWhereUniqueWithoutCustomerInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestScalarWhereInputObjectSchema as ServiceRequestScalarWhereInputObjectSchema } from './ServiceRequestScalarWhereInput.schema';
import { ServiceRequestUpdateManyMutationInputObjectSchema as ServiceRequestUpdateManyMutationInputObjectSchema } from './ServiceRequestUpdateManyMutationInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutCustomerInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutCustomerInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ServiceRequestUpdateManyMutationInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutCustomerInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateManyWithWhereWithoutCustomerInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateManyWithWhereWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateManyWithWhereWithoutCustomerInput>;
export const ServiceRequestUpdateManyWithWhereWithoutCustomerInputObjectZodSchema = makeSchema();

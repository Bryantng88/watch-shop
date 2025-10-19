import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithoutCustomerInputObjectSchema as ServiceRequestUpdateWithoutCustomerInputObjectSchema } from './ServiceRequestUpdateWithoutCustomerInput.schema';
import { ServiceRequestUncheckedUpdateWithoutCustomerInputObjectSchema as ServiceRequestUncheckedUpdateWithoutCustomerInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutCustomerInput.schema';
import { ServiceRequestCreateWithoutCustomerInputObjectSchema as ServiceRequestCreateWithoutCustomerInputObjectSchema } from './ServiceRequestCreateWithoutCustomerInput.schema';
import { ServiceRequestUncheckedCreateWithoutCustomerInputObjectSchema as ServiceRequestUncheckedCreateWithoutCustomerInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ServiceRequestUpdateWithoutCustomerInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutCustomerInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutCustomerInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutCustomerInputObjectSchema)])
}).strict();
export const ServiceRequestUpsertWithWhereUniqueWithoutCustomerInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpsertWithWhereUniqueWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpsertWithWhereUniqueWithoutCustomerInput>;
export const ServiceRequestUpsertWithWhereUniqueWithoutCustomerInputObjectZodSchema = makeSchema();

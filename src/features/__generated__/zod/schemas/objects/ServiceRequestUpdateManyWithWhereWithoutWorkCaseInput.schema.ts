import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestScalarWhereInputObjectSchema as ServiceRequestScalarWhereInputObjectSchema } from './ServiceRequestScalarWhereInput.schema';
import { ServiceRequestUpdateManyMutationInputObjectSchema as ServiceRequestUpdateManyMutationInputObjectSchema } from './ServiceRequestUpdateManyMutationInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutWorkCaseInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutWorkCaseInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ServiceRequestUpdateManyMutationInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutWorkCaseInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateManyWithWhereWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateManyWithWhereWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateManyWithWhereWithoutWorkCaseInput>;
export const ServiceRequestUpdateManyWithWhereWithoutWorkCaseInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestScalarWhereInputObjectSchema as ServiceRequestScalarWhereInputObjectSchema } from './ServiceRequestScalarWhereInput.schema';
import { ServiceRequestUpdateManyMutationInputObjectSchema as ServiceRequestUpdateManyMutationInputObjectSchema } from './ServiceRequestUpdateManyMutationInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutProductInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutProductInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ServiceRequestUpdateManyMutationInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutProductInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateManyWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateManyWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateManyWithWhereWithoutProductInput>;
export const ServiceRequestUpdateManyWithWhereWithoutProductInputObjectZodSchema = makeSchema();

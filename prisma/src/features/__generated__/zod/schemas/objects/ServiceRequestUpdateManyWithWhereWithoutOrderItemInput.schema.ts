import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestScalarWhereInputObjectSchema as ServiceRequestScalarWhereInputObjectSchema } from './ServiceRequestScalarWhereInput.schema';
import { ServiceRequestUpdateManyMutationInputObjectSchema as ServiceRequestUpdateManyMutationInputObjectSchema } from './ServiceRequestUpdateManyMutationInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutOrderItemInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutOrderItemInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ServiceRequestUpdateManyMutationInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutOrderItemInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateManyWithWhereWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateManyWithWhereWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateManyWithWhereWithoutOrderItemInput>;
export const ServiceRequestUpdateManyWithWhereWithoutOrderItemInputObjectZodSchema = makeSchema();

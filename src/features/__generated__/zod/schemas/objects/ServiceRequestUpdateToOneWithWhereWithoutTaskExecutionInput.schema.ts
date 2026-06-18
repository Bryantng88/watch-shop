import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema';
import { ServiceRequestUpdateWithoutTaskExecutionInputObjectSchema as ServiceRequestUpdateWithoutTaskExecutionInputObjectSchema } from './ServiceRequestUpdateWithoutTaskExecutionInput.schema';
import { ServiceRequestUncheckedUpdateWithoutTaskExecutionInputObjectSchema as ServiceRequestUncheckedUpdateWithoutTaskExecutionInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutTaskExecutionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ServiceRequestUpdateWithoutTaskExecutionInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutTaskExecutionInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateToOneWithWhereWithoutTaskExecutionInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateToOneWithWhereWithoutTaskExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateToOneWithWhereWithoutTaskExecutionInput>;
export const ServiceRequestUpdateToOneWithWhereWithoutTaskExecutionInputObjectZodSchema = makeSchema();

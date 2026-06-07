import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema';
import { ServiceRequestUpdateWithoutTaskInputObjectSchema as ServiceRequestUpdateWithoutTaskInputObjectSchema } from './ServiceRequestUpdateWithoutTaskInput.schema';
import { ServiceRequestUncheckedUpdateWithoutTaskInputObjectSchema as ServiceRequestUncheckedUpdateWithoutTaskInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ServiceRequestUpdateWithoutTaskInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutTaskInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateToOneWithWhereWithoutTaskInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateToOneWithWhereWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateToOneWithWhereWithoutTaskInput>;
export const ServiceRequestUpdateToOneWithWhereWithoutTaskInputObjectZodSchema = makeSchema();

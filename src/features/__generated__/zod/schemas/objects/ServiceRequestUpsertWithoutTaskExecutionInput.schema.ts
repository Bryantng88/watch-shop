import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestUpdateWithoutTaskExecutionInputObjectSchema as ServiceRequestUpdateWithoutTaskExecutionInputObjectSchema } from './ServiceRequestUpdateWithoutTaskExecutionInput.schema';
import { ServiceRequestUncheckedUpdateWithoutTaskExecutionInputObjectSchema as ServiceRequestUncheckedUpdateWithoutTaskExecutionInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutTaskExecutionInput.schema';
import { ServiceRequestCreateWithoutTaskExecutionInputObjectSchema as ServiceRequestCreateWithoutTaskExecutionInputObjectSchema } from './ServiceRequestCreateWithoutTaskExecutionInput.schema';
import { ServiceRequestUncheckedCreateWithoutTaskExecutionInputObjectSchema as ServiceRequestUncheckedCreateWithoutTaskExecutionInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutTaskExecutionInput.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ServiceRequestUpdateWithoutTaskExecutionInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutTaskExecutionInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutTaskExecutionInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutTaskExecutionInputObjectSchema)]),
  where: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional()
}).strict();
export const ServiceRequestUpsertWithoutTaskExecutionInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpsertWithoutTaskExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpsertWithoutTaskExecutionInput>;
export const ServiceRequestUpsertWithoutTaskExecutionInputObjectZodSchema = makeSchema();

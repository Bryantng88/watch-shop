import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestCreateWithoutTaskExecutionInputObjectSchema as ServiceRequestCreateWithoutTaskExecutionInputObjectSchema } from './ServiceRequestCreateWithoutTaskExecutionInput.schema';
import { ServiceRequestUncheckedCreateWithoutTaskExecutionInputObjectSchema as ServiceRequestUncheckedCreateWithoutTaskExecutionInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutTaskExecutionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutTaskExecutionInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutTaskExecutionInputObjectSchema)])
}).strict();
export const ServiceRequestCreateOrConnectWithoutTaskExecutionInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutTaskExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutTaskExecutionInput>;
export const ServiceRequestCreateOrConnectWithoutTaskExecutionInputObjectZodSchema = makeSchema();

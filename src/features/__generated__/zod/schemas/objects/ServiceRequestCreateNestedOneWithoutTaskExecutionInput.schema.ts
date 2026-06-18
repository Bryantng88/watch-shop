import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutTaskExecutionInputObjectSchema as ServiceRequestCreateWithoutTaskExecutionInputObjectSchema } from './ServiceRequestCreateWithoutTaskExecutionInput.schema';
import { ServiceRequestUncheckedCreateWithoutTaskExecutionInputObjectSchema as ServiceRequestUncheckedCreateWithoutTaskExecutionInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutTaskExecutionInput.schema';
import { ServiceRequestCreateOrConnectWithoutTaskExecutionInputObjectSchema as ServiceRequestCreateOrConnectWithoutTaskExecutionInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutTaskExecutionInput.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutTaskExecutionInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutTaskExecutionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceRequestCreateOrConnectWithoutTaskExecutionInputObjectSchema).optional(),
  connect: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).optional()
}).strict();
export const ServiceRequestCreateNestedOneWithoutTaskExecutionInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateNestedOneWithoutTaskExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateNestedOneWithoutTaskExecutionInput>;
export const ServiceRequestCreateNestedOneWithoutTaskExecutionInputObjectZodSchema = makeSchema();

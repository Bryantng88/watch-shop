import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestCreateWithoutTaskInputObjectSchema as ServiceRequestCreateWithoutTaskInputObjectSchema } from './ServiceRequestCreateWithoutTaskInput.schema';
import { ServiceRequestUncheckedCreateWithoutTaskInputObjectSchema as ServiceRequestUncheckedCreateWithoutTaskInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutTaskInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const ServiceRequestCreateOrConnectWithoutTaskInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutTaskInput>;
export const ServiceRequestCreateOrConnectWithoutTaskInputObjectZodSchema = makeSchema();

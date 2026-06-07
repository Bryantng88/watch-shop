import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutTaskInputObjectSchema as ServiceRequestCreateWithoutTaskInputObjectSchema } from './ServiceRequestCreateWithoutTaskInput.schema';
import { ServiceRequestUncheckedCreateWithoutTaskInputObjectSchema as ServiceRequestUncheckedCreateWithoutTaskInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutTaskInput.schema';
import { ServiceRequestCreateOrConnectWithoutTaskInputObjectSchema as ServiceRequestCreateOrConnectWithoutTaskInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutTaskInput.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutTaskInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutTaskInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceRequestCreateOrConnectWithoutTaskInputObjectSchema).optional(),
  connect: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).optional()
}).strict();
export const ServiceRequestCreateNestedOneWithoutTaskInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateNestedOneWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateNestedOneWithoutTaskInput>;
export const ServiceRequestCreateNestedOneWithoutTaskInputObjectZodSchema = makeSchema();

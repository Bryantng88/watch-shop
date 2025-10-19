import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestCreateWithoutOrderItemInputObjectSchema as ServiceRequestCreateWithoutOrderItemInputObjectSchema } from './ServiceRequestCreateWithoutOrderItemInput.schema';
import { ServiceRequestUncheckedCreateWithoutOrderItemInputObjectSchema as ServiceRequestUncheckedCreateWithoutOrderItemInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutOrderItemInputObjectSchema)])
}).strict();
export const ServiceRequestCreateOrConnectWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutOrderItemInput>;
export const ServiceRequestCreateOrConnectWithoutOrderItemInputObjectZodSchema = makeSchema();

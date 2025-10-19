import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestCreateWithoutProductInputObjectSchema as ServiceRequestCreateWithoutProductInputObjectSchema } from './ServiceRequestCreateWithoutProductInput.schema';
import { ServiceRequestUncheckedCreateWithoutProductInputObjectSchema as ServiceRequestUncheckedCreateWithoutProductInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutProductInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const ServiceRequestCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutProductInput>;
export const ServiceRequestCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();

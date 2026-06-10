import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestCreateWithoutWorkCaseInputObjectSchema as ServiceRequestCreateWithoutWorkCaseInputObjectSchema } from './ServiceRequestCreateWithoutWorkCaseInput.schema';
import { ServiceRequestUncheckedCreateWithoutWorkCaseInputObjectSchema as ServiceRequestUncheckedCreateWithoutWorkCaseInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutWorkCaseInputObjectSchema)])
}).strict();
export const ServiceRequestCreateOrConnectWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutWorkCaseInput>;
export const ServiceRequestCreateOrConnectWithoutWorkCaseInputObjectZodSchema = makeSchema();

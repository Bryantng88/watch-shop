import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithoutWorkCaseInputObjectSchema as ServiceRequestUpdateWithoutWorkCaseInputObjectSchema } from './ServiceRequestUpdateWithoutWorkCaseInput.schema';
import { ServiceRequestUncheckedUpdateWithoutWorkCaseInputObjectSchema as ServiceRequestUncheckedUpdateWithoutWorkCaseInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ServiceRequestUpdateWithoutWorkCaseInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutWorkCaseInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateWithWhereUniqueWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateWithWhereUniqueWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateWithWhereUniqueWithoutWorkCaseInput>;
export const ServiceRequestUpdateWithWhereUniqueWithoutWorkCaseInputObjectZodSchema = makeSchema();

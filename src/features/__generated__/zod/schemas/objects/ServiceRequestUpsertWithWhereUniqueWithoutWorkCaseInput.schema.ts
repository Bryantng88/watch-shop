import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithoutWorkCaseInputObjectSchema as ServiceRequestUpdateWithoutWorkCaseInputObjectSchema } from './ServiceRequestUpdateWithoutWorkCaseInput.schema';
import { ServiceRequestUncheckedUpdateWithoutWorkCaseInputObjectSchema as ServiceRequestUncheckedUpdateWithoutWorkCaseInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutWorkCaseInput.schema';
import { ServiceRequestCreateWithoutWorkCaseInputObjectSchema as ServiceRequestCreateWithoutWorkCaseInputObjectSchema } from './ServiceRequestCreateWithoutWorkCaseInput.schema';
import { ServiceRequestUncheckedCreateWithoutWorkCaseInputObjectSchema as ServiceRequestUncheckedCreateWithoutWorkCaseInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ServiceRequestUpdateWithoutWorkCaseInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutWorkCaseInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutWorkCaseInputObjectSchema)])
}).strict();
export const ServiceRequestUpsertWithWhereUniqueWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpsertWithWhereUniqueWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpsertWithWhereUniqueWithoutWorkCaseInput>;
export const ServiceRequestUpsertWithWhereUniqueWithoutWorkCaseInputObjectZodSchema = makeSchema();

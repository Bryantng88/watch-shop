import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithoutProductInputObjectSchema as ServiceRequestUpdateWithoutProductInputObjectSchema } from './ServiceRequestUpdateWithoutProductInput.schema';
import { ServiceRequestUncheckedUpdateWithoutProductInputObjectSchema as ServiceRequestUncheckedUpdateWithoutProductInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutProductInput.schema';
import { ServiceRequestCreateWithoutProductInputObjectSchema as ServiceRequestCreateWithoutProductInputObjectSchema } from './ServiceRequestCreateWithoutProductInput.schema';
import { ServiceRequestUncheckedCreateWithoutProductInputObjectSchema as ServiceRequestUncheckedCreateWithoutProductInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ServiceRequestUpdateWithoutProductInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutProductInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const ServiceRequestUpsertWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpsertWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpsertWithWhereUniqueWithoutProductInput>;
export const ServiceRequestUpsertWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();

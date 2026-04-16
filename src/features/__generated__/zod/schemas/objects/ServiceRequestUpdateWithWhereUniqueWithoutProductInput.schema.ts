import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithoutProductInputObjectSchema as ServiceRequestUpdateWithoutProductInputObjectSchema } from './ServiceRequestUpdateWithoutProductInput.schema';
import { ServiceRequestUncheckedUpdateWithoutProductInputObjectSchema as ServiceRequestUncheckedUpdateWithoutProductInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ServiceRequestUpdateWithoutProductInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateWithWhereUniqueWithoutProductInput>;
export const ServiceRequestUpdateWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestUpdateWithoutTaskInputObjectSchema as ServiceRequestUpdateWithoutTaskInputObjectSchema } from './ServiceRequestUpdateWithoutTaskInput.schema';
import { ServiceRequestUncheckedUpdateWithoutTaskInputObjectSchema as ServiceRequestUncheckedUpdateWithoutTaskInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutTaskInput.schema';
import { ServiceRequestCreateWithoutTaskInputObjectSchema as ServiceRequestCreateWithoutTaskInputObjectSchema } from './ServiceRequestCreateWithoutTaskInput.schema';
import { ServiceRequestUncheckedCreateWithoutTaskInputObjectSchema as ServiceRequestUncheckedCreateWithoutTaskInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutTaskInput.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ServiceRequestUpdateWithoutTaskInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutTaskInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutTaskInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutTaskInputObjectSchema)]),
  where: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional()
}).strict();
export const ServiceRequestUpsertWithoutTaskInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpsertWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpsertWithoutTaskInput>;
export const ServiceRequestUpsertWithoutTaskInputObjectZodSchema = makeSchema();

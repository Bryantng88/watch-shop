import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutTaskExecutionInputObjectSchema as ServiceRequestCreateWithoutTaskExecutionInputObjectSchema } from './ServiceRequestCreateWithoutTaskExecutionInput.schema';
import { ServiceRequestUncheckedCreateWithoutTaskExecutionInputObjectSchema as ServiceRequestUncheckedCreateWithoutTaskExecutionInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutTaskExecutionInput.schema';
import { ServiceRequestCreateOrConnectWithoutTaskExecutionInputObjectSchema as ServiceRequestCreateOrConnectWithoutTaskExecutionInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutTaskExecutionInput.schema';
import { ServiceRequestUpsertWithoutTaskExecutionInputObjectSchema as ServiceRequestUpsertWithoutTaskExecutionInputObjectSchema } from './ServiceRequestUpsertWithoutTaskExecutionInput.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateToOneWithWhereWithoutTaskExecutionInputObjectSchema as ServiceRequestUpdateToOneWithWhereWithoutTaskExecutionInputObjectSchema } from './ServiceRequestUpdateToOneWithWhereWithoutTaskExecutionInput.schema';
import { ServiceRequestUpdateWithoutTaskExecutionInputObjectSchema as ServiceRequestUpdateWithoutTaskExecutionInputObjectSchema } from './ServiceRequestUpdateWithoutTaskExecutionInput.schema';
import { ServiceRequestUncheckedUpdateWithoutTaskExecutionInputObjectSchema as ServiceRequestUncheckedUpdateWithoutTaskExecutionInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutTaskExecutionInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutTaskExecutionInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutTaskExecutionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceRequestCreateOrConnectWithoutTaskExecutionInputObjectSchema).optional(),
  upsert: z.lazy(() => ServiceRequestUpsertWithoutTaskExecutionInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ServiceRequestWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ServiceRequestWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ServiceRequestUpdateToOneWithWhereWithoutTaskExecutionInputObjectSchema), z.lazy(() => ServiceRequestUpdateWithoutTaskExecutionInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutTaskExecutionInputObjectSchema)]).optional()
}).strict();
export const ServiceRequestUpdateOneWithoutTaskExecutionNestedInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateOneWithoutTaskExecutionNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateOneWithoutTaskExecutionNestedInput>;
export const ServiceRequestUpdateOneWithoutTaskExecutionNestedInputObjectZodSchema = makeSchema();

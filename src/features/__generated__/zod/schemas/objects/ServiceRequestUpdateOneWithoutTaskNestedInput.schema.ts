import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutTaskInputObjectSchema as ServiceRequestCreateWithoutTaskInputObjectSchema } from './ServiceRequestCreateWithoutTaskInput.schema';
import { ServiceRequestUncheckedCreateWithoutTaskInputObjectSchema as ServiceRequestUncheckedCreateWithoutTaskInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutTaskInput.schema';
import { ServiceRequestCreateOrConnectWithoutTaskInputObjectSchema as ServiceRequestCreateOrConnectWithoutTaskInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutTaskInput.schema';
import { ServiceRequestUpsertWithoutTaskInputObjectSchema as ServiceRequestUpsertWithoutTaskInputObjectSchema } from './ServiceRequestUpsertWithoutTaskInput.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateToOneWithWhereWithoutTaskInputObjectSchema as ServiceRequestUpdateToOneWithWhereWithoutTaskInputObjectSchema } from './ServiceRequestUpdateToOneWithWhereWithoutTaskInput.schema';
import { ServiceRequestUpdateWithoutTaskInputObjectSchema as ServiceRequestUpdateWithoutTaskInputObjectSchema } from './ServiceRequestUpdateWithoutTaskInput.schema';
import { ServiceRequestUncheckedUpdateWithoutTaskInputObjectSchema as ServiceRequestUncheckedUpdateWithoutTaskInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutTaskInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutTaskInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceRequestCreateOrConnectWithoutTaskInputObjectSchema).optional(),
  upsert: z.lazy(() => ServiceRequestUpsertWithoutTaskInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ServiceRequestWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ServiceRequestWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ServiceRequestUpdateToOneWithWhereWithoutTaskInputObjectSchema), z.lazy(() => ServiceRequestUpdateWithoutTaskInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutTaskInputObjectSchema)]).optional()
}).strict();
export const ServiceRequestUpdateOneWithoutTaskNestedInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateOneWithoutTaskNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateOneWithoutTaskNestedInput>;
export const ServiceRequestUpdateOneWithoutTaskNestedInputObjectZodSchema = makeSchema();

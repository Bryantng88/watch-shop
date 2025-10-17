import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutOrderItemInputObjectSchema as ServiceRequestCreateWithoutOrderItemInputObjectSchema } from './ServiceRequestCreateWithoutOrderItemInput.schema';
import { ServiceRequestUncheckedCreateWithoutOrderItemInputObjectSchema as ServiceRequestUncheckedCreateWithoutOrderItemInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutOrderItemInput.schema';
import { ServiceRequestCreateOrConnectWithoutOrderItemInputObjectSchema as ServiceRequestCreateOrConnectWithoutOrderItemInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutOrderItemInput.schema';
import { ServiceRequestUpsertWithWhereUniqueWithoutOrderItemInputObjectSchema as ServiceRequestUpsertWithWhereUniqueWithoutOrderItemInputObjectSchema } from './ServiceRequestUpsertWithWhereUniqueWithoutOrderItemInput.schema';
import { ServiceRequestCreateManyOrderItemInputEnvelopeObjectSchema as ServiceRequestCreateManyOrderItemInputEnvelopeObjectSchema } from './ServiceRequestCreateManyOrderItemInputEnvelope.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithWhereUniqueWithoutOrderItemInputObjectSchema as ServiceRequestUpdateWithWhereUniqueWithoutOrderItemInputObjectSchema } from './ServiceRequestUpdateWithWhereUniqueWithoutOrderItemInput.schema';
import { ServiceRequestUpdateManyWithWhereWithoutOrderItemInputObjectSchema as ServiceRequestUpdateManyWithWhereWithoutOrderItemInputObjectSchema } from './ServiceRequestUpdateManyWithWhereWithoutOrderItemInput.schema';
import { ServiceRequestScalarWhereInputObjectSchema as ServiceRequestScalarWhereInputObjectSchema } from './ServiceRequestScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceRequestCreateWithoutOrderItemInputObjectSchema).array(), z.lazy(() => ServiceRequestUncheckedCreateWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutOrderItemInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceRequestCreateOrConnectWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceRequestCreateOrConnectWithoutOrderItemInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ServiceRequestUpsertWithWhereUniqueWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceRequestUpsertWithWhereUniqueWithoutOrderItemInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceRequestCreateManyOrderItemInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ServiceRequestUpdateWithWhereUniqueWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceRequestUpdateWithWhereUniqueWithoutOrderItemInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ServiceRequestUpdateManyWithWhereWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceRequestUpdateManyWithWhereWithoutOrderItemInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ServiceRequestScalarWhereInputObjectSchema), z.lazy(() => ServiceRequestScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ServiceRequestUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema: z.ZodType<Prisma.ServiceRequestUncheckedUpdateManyWithoutOrderItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUncheckedUpdateManyWithoutOrderItemNestedInput>;
export const ServiceRequestUncheckedUpdateManyWithoutOrderItemNestedInputObjectZodSchema = makeSchema();

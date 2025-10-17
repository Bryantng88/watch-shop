import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutProductInputObjectSchema as ServiceRequestCreateWithoutProductInputObjectSchema } from './ServiceRequestCreateWithoutProductInput.schema';
import { ServiceRequestUncheckedCreateWithoutProductInputObjectSchema as ServiceRequestUncheckedCreateWithoutProductInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutProductInput.schema';
import { ServiceRequestCreateOrConnectWithoutProductInputObjectSchema as ServiceRequestCreateOrConnectWithoutProductInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutProductInput.schema';
import { ServiceRequestUpsertWithWhereUniqueWithoutProductInputObjectSchema as ServiceRequestUpsertWithWhereUniqueWithoutProductInputObjectSchema } from './ServiceRequestUpsertWithWhereUniqueWithoutProductInput.schema';
import { ServiceRequestCreateManyProductInputEnvelopeObjectSchema as ServiceRequestCreateManyProductInputEnvelopeObjectSchema } from './ServiceRequestCreateManyProductInputEnvelope.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithWhereUniqueWithoutProductInputObjectSchema as ServiceRequestUpdateWithWhereUniqueWithoutProductInputObjectSchema } from './ServiceRequestUpdateWithWhereUniqueWithoutProductInput.schema';
import { ServiceRequestUpdateManyWithWhereWithoutProductInputObjectSchema as ServiceRequestUpdateManyWithWhereWithoutProductInputObjectSchema } from './ServiceRequestUpdateManyWithWhereWithoutProductInput.schema';
import { ServiceRequestScalarWhereInputObjectSchema as ServiceRequestScalarWhereInputObjectSchema } from './ServiceRequestScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutProductInputObjectSchema), z.lazy(() => ServiceRequestCreateWithoutProductInputObjectSchema).array(), z.lazy(() => ServiceRequestUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceRequestCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => ServiceRequestCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ServiceRequestUpsertWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => ServiceRequestUpsertWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceRequestCreateManyProductInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ServiceRequestUpdateWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => ServiceRequestUpdateWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ServiceRequestUpdateManyWithWhereWithoutProductInputObjectSchema), z.lazy(() => ServiceRequestUpdateManyWithWhereWithoutProductInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ServiceRequestScalarWhereInputObjectSchema), z.lazy(() => ServiceRequestScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ServiceRequestUncheckedUpdateManyWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.ServiceRequestUncheckedUpdateManyWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUncheckedUpdateManyWithoutProductNestedInput>;
export const ServiceRequestUncheckedUpdateManyWithoutProductNestedInputObjectZodSchema = makeSchema();

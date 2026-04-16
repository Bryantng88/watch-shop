import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutUserInputObjectSchema as ServiceRequestCreateWithoutUserInputObjectSchema } from './ServiceRequestCreateWithoutUserInput.schema';
import { ServiceRequestUncheckedCreateWithoutUserInputObjectSchema as ServiceRequestUncheckedCreateWithoutUserInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutUserInput.schema';
import { ServiceRequestCreateOrConnectWithoutUserInputObjectSchema as ServiceRequestCreateOrConnectWithoutUserInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutUserInput.schema';
import { ServiceRequestUpsertWithWhereUniqueWithoutUserInputObjectSchema as ServiceRequestUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './ServiceRequestUpsertWithWhereUniqueWithoutUserInput.schema';
import { ServiceRequestCreateManyUserInputEnvelopeObjectSchema as ServiceRequestCreateManyUserInputEnvelopeObjectSchema } from './ServiceRequestCreateManyUserInputEnvelope.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithWhereUniqueWithoutUserInputObjectSchema as ServiceRequestUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './ServiceRequestUpdateWithWhereUniqueWithoutUserInput.schema';
import { ServiceRequestUpdateManyWithWhereWithoutUserInputObjectSchema as ServiceRequestUpdateManyWithWhereWithoutUserInputObjectSchema } from './ServiceRequestUpdateManyWithWhereWithoutUserInput.schema';
import { ServiceRequestScalarWhereInputObjectSchema as ServiceRequestScalarWhereInputObjectSchema } from './ServiceRequestScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutUserInputObjectSchema), z.lazy(() => ServiceRequestCreateWithoutUserInputObjectSchema).array(), z.lazy(() => ServiceRequestUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceRequestCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => ServiceRequestCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ServiceRequestUpsertWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => ServiceRequestUpsertWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceRequestCreateManyUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ServiceRequestUpdateWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => ServiceRequestUpdateWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ServiceRequestUpdateManyWithWhereWithoutUserInputObjectSchema), z.lazy(() => ServiceRequestUpdateManyWithWhereWithoutUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ServiceRequestScalarWhereInputObjectSchema), z.lazy(() => ServiceRequestScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ServiceRequestUncheckedUpdateManyWithoutUserNestedInputObjectSchema: z.ZodType<Prisma.ServiceRequestUncheckedUpdateManyWithoutUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUncheckedUpdateManyWithoutUserNestedInput>;
export const ServiceRequestUncheckedUpdateManyWithoutUserNestedInputObjectZodSchema = makeSchema();

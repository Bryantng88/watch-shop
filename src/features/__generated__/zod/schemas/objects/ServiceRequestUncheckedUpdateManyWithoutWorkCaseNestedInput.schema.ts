import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutWorkCaseInputObjectSchema as ServiceRequestCreateWithoutWorkCaseInputObjectSchema } from './ServiceRequestCreateWithoutWorkCaseInput.schema';
import { ServiceRequestUncheckedCreateWithoutWorkCaseInputObjectSchema as ServiceRequestUncheckedCreateWithoutWorkCaseInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutWorkCaseInput.schema';
import { ServiceRequestCreateOrConnectWithoutWorkCaseInputObjectSchema as ServiceRequestCreateOrConnectWithoutWorkCaseInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutWorkCaseInput.schema';
import { ServiceRequestUpsertWithWhereUniqueWithoutWorkCaseInputObjectSchema as ServiceRequestUpsertWithWhereUniqueWithoutWorkCaseInputObjectSchema } from './ServiceRequestUpsertWithWhereUniqueWithoutWorkCaseInput.schema';
import { ServiceRequestCreateManyWorkCaseInputEnvelopeObjectSchema as ServiceRequestCreateManyWorkCaseInputEnvelopeObjectSchema } from './ServiceRequestCreateManyWorkCaseInputEnvelope.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithWhereUniqueWithoutWorkCaseInputObjectSchema as ServiceRequestUpdateWithWhereUniqueWithoutWorkCaseInputObjectSchema } from './ServiceRequestUpdateWithWhereUniqueWithoutWorkCaseInput.schema';
import { ServiceRequestUpdateManyWithWhereWithoutWorkCaseInputObjectSchema as ServiceRequestUpdateManyWithWhereWithoutWorkCaseInputObjectSchema } from './ServiceRequestUpdateManyWithWhereWithoutWorkCaseInput.schema';
import { ServiceRequestScalarWhereInputObjectSchema as ServiceRequestScalarWhereInputObjectSchema } from './ServiceRequestScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => ServiceRequestCreateWithoutWorkCaseInputObjectSchema).array(), z.lazy(() => ServiceRequestUncheckedCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutWorkCaseInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceRequestCreateOrConnectWithoutWorkCaseInputObjectSchema), z.lazy(() => ServiceRequestCreateOrConnectWithoutWorkCaseInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ServiceRequestUpsertWithWhereUniqueWithoutWorkCaseInputObjectSchema), z.lazy(() => ServiceRequestUpsertWithWhereUniqueWithoutWorkCaseInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceRequestCreateManyWorkCaseInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ServiceRequestUpdateWithWhereUniqueWithoutWorkCaseInputObjectSchema), z.lazy(() => ServiceRequestUpdateWithWhereUniqueWithoutWorkCaseInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ServiceRequestUpdateManyWithWhereWithoutWorkCaseInputObjectSchema), z.lazy(() => ServiceRequestUpdateManyWithWhereWithoutWorkCaseInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ServiceRequestScalarWhereInputObjectSchema), z.lazy(() => ServiceRequestScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ServiceRequestUncheckedUpdateManyWithoutWorkCaseNestedInputObjectSchema: z.ZodType<Prisma.ServiceRequestUncheckedUpdateManyWithoutWorkCaseNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUncheckedUpdateManyWithoutWorkCaseNestedInput>;
export const ServiceRequestUncheckedUpdateManyWithoutWorkCaseNestedInputObjectZodSchema = makeSchema();

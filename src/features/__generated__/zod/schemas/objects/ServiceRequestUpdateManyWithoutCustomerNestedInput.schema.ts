import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutCustomerInputObjectSchema as ServiceRequestCreateWithoutCustomerInputObjectSchema } from './ServiceRequestCreateWithoutCustomerInput.schema';
import { ServiceRequestUncheckedCreateWithoutCustomerInputObjectSchema as ServiceRequestUncheckedCreateWithoutCustomerInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutCustomerInput.schema';
import { ServiceRequestCreateOrConnectWithoutCustomerInputObjectSchema as ServiceRequestCreateOrConnectWithoutCustomerInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutCustomerInput.schema';
import { ServiceRequestUpsertWithWhereUniqueWithoutCustomerInputObjectSchema as ServiceRequestUpsertWithWhereUniqueWithoutCustomerInputObjectSchema } from './ServiceRequestUpsertWithWhereUniqueWithoutCustomerInput.schema';
import { ServiceRequestCreateManyCustomerInputEnvelopeObjectSchema as ServiceRequestCreateManyCustomerInputEnvelopeObjectSchema } from './ServiceRequestCreateManyCustomerInputEnvelope.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithWhereUniqueWithoutCustomerInputObjectSchema as ServiceRequestUpdateWithWhereUniqueWithoutCustomerInputObjectSchema } from './ServiceRequestUpdateWithWhereUniqueWithoutCustomerInput.schema';
import { ServiceRequestUpdateManyWithWhereWithoutCustomerInputObjectSchema as ServiceRequestUpdateManyWithWhereWithoutCustomerInputObjectSchema } from './ServiceRequestUpdateManyWithWhereWithoutCustomerInput.schema';
import { ServiceRequestScalarWhereInputObjectSchema as ServiceRequestScalarWhereInputObjectSchema } from './ServiceRequestScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutCustomerInputObjectSchema), z.lazy(() => ServiceRequestCreateWithoutCustomerInputObjectSchema).array(), z.lazy(() => ServiceRequestUncheckedCreateWithoutCustomerInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutCustomerInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceRequestCreateOrConnectWithoutCustomerInputObjectSchema), z.lazy(() => ServiceRequestCreateOrConnectWithoutCustomerInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ServiceRequestUpsertWithWhereUniqueWithoutCustomerInputObjectSchema), z.lazy(() => ServiceRequestUpsertWithWhereUniqueWithoutCustomerInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceRequestCreateManyCustomerInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ServiceRequestUpdateWithWhereUniqueWithoutCustomerInputObjectSchema), z.lazy(() => ServiceRequestUpdateWithWhereUniqueWithoutCustomerInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ServiceRequestUpdateManyWithWhereWithoutCustomerInputObjectSchema), z.lazy(() => ServiceRequestUpdateManyWithWhereWithoutCustomerInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ServiceRequestScalarWhereInputObjectSchema), z.lazy(() => ServiceRequestScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ServiceRequestUpdateManyWithoutCustomerNestedInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateManyWithoutCustomerNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateManyWithoutCustomerNestedInput>;
export const ServiceRequestUpdateManyWithoutCustomerNestedInputObjectZodSchema = makeSchema();

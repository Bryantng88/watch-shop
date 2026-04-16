import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutProductVariantInputObjectSchema as ServiceRequestCreateWithoutProductVariantInputObjectSchema } from './ServiceRequestCreateWithoutProductVariantInput.schema';
import { ServiceRequestUncheckedCreateWithoutProductVariantInputObjectSchema as ServiceRequestUncheckedCreateWithoutProductVariantInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutProductVariantInput.schema';
import { ServiceRequestCreateOrConnectWithoutProductVariantInputObjectSchema as ServiceRequestCreateOrConnectWithoutProductVariantInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutProductVariantInput.schema';
import { ServiceRequestUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema as ServiceRequestUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema } from './ServiceRequestUpsertWithWhereUniqueWithoutProductVariantInput.schema';
import { ServiceRequestCreateManyProductVariantInputEnvelopeObjectSchema as ServiceRequestCreateManyProductVariantInputEnvelopeObjectSchema } from './ServiceRequestCreateManyProductVariantInputEnvelope.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema as ServiceRequestUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema } from './ServiceRequestUpdateWithWhereUniqueWithoutProductVariantInput.schema';
import { ServiceRequestUpdateManyWithWhereWithoutProductVariantInputObjectSchema as ServiceRequestUpdateManyWithWhereWithoutProductVariantInputObjectSchema } from './ServiceRequestUpdateManyWithWhereWithoutProductVariantInput.schema';
import { ServiceRequestScalarWhereInputObjectSchema as ServiceRequestScalarWhereInputObjectSchema } from './ServiceRequestScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutProductVariantInputObjectSchema), z.lazy(() => ServiceRequestCreateWithoutProductVariantInputObjectSchema).array(), z.lazy(() => ServiceRequestUncheckedCreateWithoutProductVariantInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutProductVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceRequestCreateOrConnectWithoutProductVariantInputObjectSchema), z.lazy(() => ServiceRequestCreateOrConnectWithoutProductVariantInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ServiceRequestUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema), z.lazy(() => ServiceRequestUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceRequestCreateManyProductVariantInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ServiceRequestUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema), z.lazy(() => ServiceRequestUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ServiceRequestUpdateManyWithWhereWithoutProductVariantInputObjectSchema), z.lazy(() => ServiceRequestUpdateManyWithWhereWithoutProductVariantInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ServiceRequestScalarWhereInputObjectSchema), z.lazy(() => ServiceRequestScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ServiceRequestUncheckedUpdateManyWithoutProductVariantNestedInputObjectSchema: z.ZodType<Prisma.ServiceRequestUncheckedUpdateManyWithoutProductVariantNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUncheckedUpdateManyWithoutProductVariantNestedInput>;
export const ServiceRequestUncheckedUpdateManyWithoutProductVariantNestedInputObjectZodSchema = makeSchema();

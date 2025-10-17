import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutVariantInputObjectSchema as ServiceRequestCreateWithoutVariantInputObjectSchema } from './ServiceRequestCreateWithoutVariantInput.schema';
import { ServiceRequestUncheckedCreateWithoutVariantInputObjectSchema as ServiceRequestUncheckedCreateWithoutVariantInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutVariantInput.schema';
import { ServiceRequestCreateOrConnectWithoutVariantInputObjectSchema as ServiceRequestCreateOrConnectWithoutVariantInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutVariantInput.schema';
import { ServiceRequestUpsertWithWhereUniqueWithoutVariantInputObjectSchema as ServiceRequestUpsertWithWhereUniqueWithoutVariantInputObjectSchema } from './ServiceRequestUpsertWithWhereUniqueWithoutVariantInput.schema';
import { ServiceRequestCreateManyVariantInputEnvelopeObjectSchema as ServiceRequestCreateManyVariantInputEnvelopeObjectSchema } from './ServiceRequestCreateManyVariantInputEnvelope.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithWhereUniqueWithoutVariantInputObjectSchema as ServiceRequestUpdateWithWhereUniqueWithoutVariantInputObjectSchema } from './ServiceRequestUpdateWithWhereUniqueWithoutVariantInput.schema';
import { ServiceRequestUpdateManyWithWhereWithoutVariantInputObjectSchema as ServiceRequestUpdateManyWithWhereWithoutVariantInputObjectSchema } from './ServiceRequestUpdateManyWithWhereWithoutVariantInput.schema';
import { ServiceRequestScalarWhereInputObjectSchema as ServiceRequestScalarWhereInputObjectSchema } from './ServiceRequestScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutVariantInputObjectSchema), z.lazy(() => ServiceRequestCreateWithoutVariantInputObjectSchema).array(), z.lazy(() => ServiceRequestUncheckedCreateWithoutVariantInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceRequestCreateOrConnectWithoutVariantInputObjectSchema), z.lazy(() => ServiceRequestCreateOrConnectWithoutVariantInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ServiceRequestUpsertWithWhereUniqueWithoutVariantInputObjectSchema), z.lazy(() => ServiceRequestUpsertWithWhereUniqueWithoutVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceRequestCreateManyVariantInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ServiceRequestUpdateWithWhereUniqueWithoutVariantInputObjectSchema), z.lazy(() => ServiceRequestUpdateWithWhereUniqueWithoutVariantInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ServiceRequestUpdateManyWithWhereWithoutVariantInputObjectSchema), z.lazy(() => ServiceRequestUpdateManyWithWhereWithoutVariantInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ServiceRequestScalarWhereInputObjectSchema), z.lazy(() => ServiceRequestScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ServiceRequestUncheckedUpdateManyWithoutVariantNestedInputObjectSchema: z.ZodType<Prisma.ServiceRequestUncheckedUpdateManyWithoutVariantNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUncheckedUpdateManyWithoutVariantNestedInput>;
export const ServiceRequestUncheckedUpdateManyWithoutVariantNestedInputObjectZodSchema = makeSchema();

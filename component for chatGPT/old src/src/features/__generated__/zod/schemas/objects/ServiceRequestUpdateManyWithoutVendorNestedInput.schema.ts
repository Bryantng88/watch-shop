import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutVendorInputObjectSchema as ServiceRequestCreateWithoutVendorInputObjectSchema } from './ServiceRequestCreateWithoutVendorInput.schema';
import { ServiceRequestUncheckedCreateWithoutVendorInputObjectSchema as ServiceRequestUncheckedCreateWithoutVendorInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutVendorInput.schema';
import { ServiceRequestCreateOrConnectWithoutVendorInputObjectSchema as ServiceRequestCreateOrConnectWithoutVendorInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutVendorInput.schema';
import { ServiceRequestUpsertWithWhereUniqueWithoutVendorInputObjectSchema as ServiceRequestUpsertWithWhereUniqueWithoutVendorInputObjectSchema } from './ServiceRequestUpsertWithWhereUniqueWithoutVendorInput.schema';
import { ServiceRequestCreateManyVendorInputEnvelopeObjectSchema as ServiceRequestCreateManyVendorInputEnvelopeObjectSchema } from './ServiceRequestCreateManyVendorInputEnvelope.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithWhereUniqueWithoutVendorInputObjectSchema as ServiceRequestUpdateWithWhereUniqueWithoutVendorInputObjectSchema } from './ServiceRequestUpdateWithWhereUniqueWithoutVendorInput.schema';
import { ServiceRequestUpdateManyWithWhereWithoutVendorInputObjectSchema as ServiceRequestUpdateManyWithWhereWithoutVendorInputObjectSchema } from './ServiceRequestUpdateManyWithWhereWithoutVendorInput.schema';
import { ServiceRequestScalarWhereInputObjectSchema as ServiceRequestScalarWhereInputObjectSchema } from './ServiceRequestScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutVendorInputObjectSchema), z.lazy(() => ServiceRequestCreateWithoutVendorInputObjectSchema).array(), z.lazy(() => ServiceRequestUncheckedCreateWithoutVendorInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutVendorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceRequestCreateOrConnectWithoutVendorInputObjectSchema), z.lazy(() => ServiceRequestCreateOrConnectWithoutVendorInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ServiceRequestUpsertWithWhereUniqueWithoutVendorInputObjectSchema), z.lazy(() => ServiceRequestUpsertWithWhereUniqueWithoutVendorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceRequestCreateManyVendorInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ServiceRequestUpdateWithWhereUniqueWithoutVendorInputObjectSchema), z.lazy(() => ServiceRequestUpdateWithWhereUniqueWithoutVendorInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ServiceRequestUpdateManyWithWhereWithoutVendorInputObjectSchema), z.lazy(() => ServiceRequestUpdateManyWithWhereWithoutVendorInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ServiceRequestScalarWhereInputObjectSchema), z.lazy(() => ServiceRequestScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ServiceRequestUpdateManyWithoutVendorNestedInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateManyWithoutVendorNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateManyWithoutVendorNestedInput>;
export const ServiceRequestUpdateManyWithoutVendorNestedInputObjectZodSchema = makeSchema();

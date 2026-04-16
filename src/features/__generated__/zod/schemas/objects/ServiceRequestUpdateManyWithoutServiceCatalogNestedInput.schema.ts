import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutServiceCatalogInputObjectSchema as ServiceRequestCreateWithoutServiceCatalogInputObjectSchema } from './ServiceRequestCreateWithoutServiceCatalogInput.schema';
import { ServiceRequestUncheckedCreateWithoutServiceCatalogInputObjectSchema as ServiceRequestUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutServiceCatalogInput.schema';
import { ServiceRequestCreateOrConnectWithoutServiceCatalogInputObjectSchema as ServiceRequestCreateOrConnectWithoutServiceCatalogInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutServiceCatalogInput.schema';
import { ServiceRequestUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema as ServiceRequestUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema } from './ServiceRequestUpsertWithWhereUniqueWithoutServiceCatalogInput.schema';
import { ServiceRequestCreateManyServiceCatalogInputEnvelopeObjectSchema as ServiceRequestCreateManyServiceCatalogInputEnvelopeObjectSchema } from './ServiceRequestCreateManyServiceCatalogInputEnvelope.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema as ServiceRequestUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema } from './ServiceRequestUpdateWithWhereUniqueWithoutServiceCatalogInput.schema';
import { ServiceRequestUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema as ServiceRequestUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema } from './ServiceRequestUpdateManyWithWhereWithoutServiceCatalogInput.schema';
import { ServiceRequestScalarWhereInputObjectSchema as ServiceRequestScalarWhereInputObjectSchema } from './ServiceRequestScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => ServiceRequestCreateWithoutServiceCatalogInputObjectSchema).array(), z.lazy(() => ServiceRequestUncheckedCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceRequestCreateOrConnectWithoutServiceCatalogInputObjectSchema), z.lazy(() => ServiceRequestCreateOrConnectWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ServiceRequestUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema), z.lazy(() => ServiceRequestUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceRequestCreateManyServiceCatalogInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ServiceRequestUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema), z.lazy(() => ServiceRequestUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ServiceRequestUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema), z.lazy(() => ServiceRequestUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ServiceRequestScalarWhereInputObjectSchema), z.lazy(() => ServiceRequestScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ServiceRequestUpdateManyWithoutServiceCatalogNestedInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateManyWithoutServiceCatalogNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateManyWithoutServiceCatalogNestedInput>;
export const ServiceRequestUpdateManyWithoutServiceCatalogNestedInputObjectZodSchema = makeSchema();

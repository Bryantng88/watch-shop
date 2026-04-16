import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutProductVariantInputObjectSchema as ServiceRequestCreateWithoutProductVariantInputObjectSchema } from './ServiceRequestCreateWithoutProductVariantInput.schema';
import { ServiceRequestUncheckedCreateWithoutProductVariantInputObjectSchema as ServiceRequestUncheckedCreateWithoutProductVariantInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutProductVariantInput.schema';
import { ServiceRequestCreateOrConnectWithoutProductVariantInputObjectSchema as ServiceRequestCreateOrConnectWithoutProductVariantInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutProductVariantInput.schema';
import { ServiceRequestCreateManyProductVariantInputEnvelopeObjectSchema as ServiceRequestCreateManyProductVariantInputEnvelopeObjectSchema } from './ServiceRequestCreateManyProductVariantInputEnvelope.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutProductVariantInputObjectSchema), z.lazy(() => ServiceRequestCreateWithoutProductVariantInputObjectSchema).array(), z.lazy(() => ServiceRequestUncheckedCreateWithoutProductVariantInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutProductVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceRequestCreateOrConnectWithoutProductVariantInputObjectSchema), z.lazy(() => ServiceRequestCreateOrConnectWithoutProductVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceRequestCreateManyProductVariantInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ServiceRequestCreateNestedManyWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateNestedManyWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateNestedManyWithoutProductVariantInput>;
export const ServiceRequestCreateNestedManyWithoutProductVariantInputObjectZodSchema = makeSchema();

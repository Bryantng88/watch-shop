import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutVariantInputObjectSchema as ServiceRequestCreateWithoutVariantInputObjectSchema } from './ServiceRequestCreateWithoutVariantInput.schema';
import { ServiceRequestUncheckedCreateWithoutVariantInputObjectSchema as ServiceRequestUncheckedCreateWithoutVariantInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutVariantInput.schema';
import { ServiceRequestCreateOrConnectWithoutVariantInputObjectSchema as ServiceRequestCreateOrConnectWithoutVariantInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutVariantInput.schema';
import { ServiceRequestCreateManyVariantInputEnvelopeObjectSchema as ServiceRequestCreateManyVariantInputEnvelopeObjectSchema } from './ServiceRequestCreateManyVariantInputEnvelope.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutVariantInputObjectSchema), z.lazy(() => ServiceRequestCreateWithoutVariantInputObjectSchema).array(), z.lazy(() => ServiceRequestUncheckedCreateWithoutVariantInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceRequestCreateOrConnectWithoutVariantInputObjectSchema), z.lazy(() => ServiceRequestCreateOrConnectWithoutVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceRequestCreateManyVariantInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ServiceRequestUncheckedCreateNestedManyWithoutVariantInputObjectSchema: z.ZodType<Prisma.ServiceRequestUncheckedCreateNestedManyWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUncheckedCreateNestedManyWithoutVariantInput>;
export const ServiceRequestUncheckedCreateNestedManyWithoutVariantInputObjectZodSchema = makeSchema();

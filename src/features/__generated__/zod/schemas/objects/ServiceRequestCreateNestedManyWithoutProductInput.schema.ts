import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutProductInputObjectSchema as ServiceRequestCreateWithoutProductInputObjectSchema } from './ServiceRequestCreateWithoutProductInput.schema';
import { ServiceRequestUncheckedCreateWithoutProductInputObjectSchema as ServiceRequestUncheckedCreateWithoutProductInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutProductInput.schema';
import { ServiceRequestCreateOrConnectWithoutProductInputObjectSchema as ServiceRequestCreateOrConnectWithoutProductInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutProductInput.schema';
import { ServiceRequestCreateManyProductInputEnvelopeObjectSchema as ServiceRequestCreateManyProductInputEnvelopeObjectSchema } from './ServiceRequestCreateManyProductInputEnvelope.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutProductInputObjectSchema), z.lazy(() => ServiceRequestCreateWithoutProductInputObjectSchema).array(), z.lazy(() => ServiceRequestUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceRequestCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => ServiceRequestCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceRequestCreateManyProductInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ServiceRequestCreateNestedManyWithoutProductInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateNestedManyWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateNestedManyWithoutProductInput>;
export const ServiceRequestCreateNestedManyWithoutProductInputObjectZodSchema = makeSchema();

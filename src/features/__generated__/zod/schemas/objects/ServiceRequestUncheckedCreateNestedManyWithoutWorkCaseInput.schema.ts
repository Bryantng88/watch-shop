import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutWorkCaseInputObjectSchema as ServiceRequestCreateWithoutWorkCaseInputObjectSchema } from './ServiceRequestCreateWithoutWorkCaseInput.schema';
import { ServiceRequestUncheckedCreateWithoutWorkCaseInputObjectSchema as ServiceRequestUncheckedCreateWithoutWorkCaseInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutWorkCaseInput.schema';
import { ServiceRequestCreateOrConnectWithoutWorkCaseInputObjectSchema as ServiceRequestCreateOrConnectWithoutWorkCaseInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutWorkCaseInput.schema';
import { ServiceRequestCreateManyWorkCaseInputEnvelopeObjectSchema as ServiceRequestCreateManyWorkCaseInputEnvelopeObjectSchema } from './ServiceRequestCreateManyWorkCaseInputEnvelope.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => ServiceRequestCreateWithoutWorkCaseInputObjectSchema).array(), z.lazy(() => ServiceRequestUncheckedCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutWorkCaseInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceRequestCreateOrConnectWithoutWorkCaseInputObjectSchema), z.lazy(() => ServiceRequestCreateOrConnectWithoutWorkCaseInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceRequestCreateManyWorkCaseInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ServiceRequestUncheckedCreateNestedManyWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.ServiceRequestUncheckedCreateNestedManyWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUncheckedCreateNestedManyWithoutWorkCaseInput>;
export const ServiceRequestUncheckedCreateNestedManyWithoutWorkCaseInputObjectZodSchema = makeSchema();

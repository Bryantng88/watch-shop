import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutUserInputObjectSchema as ServiceRequestCreateWithoutUserInputObjectSchema } from './ServiceRequestCreateWithoutUserInput.schema';
import { ServiceRequestUncheckedCreateWithoutUserInputObjectSchema as ServiceRequestUncheckedCreateWithoutUserInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutUserInput.schema';
import { ServiceRequestCreateOrConnectWithoutUserInputObjectSchema as ServiceRequestCreateOrConnectWithoutUserInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutUserInput.schema';
import { ServiceRequestCreateManyUserInputEnvelopeObjectSchema as ServiceRequestCreateManyUserInputEnvelopeObjectSchema } from './ServiceRequestCreateManyUserInputEnvelope.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutUserInputObjectSchema), z.lazy(() => ServiceRequestCreateWithoutUserInputObjectSchema).array(), z.lazy(() => ServiceRequestUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceRequestCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => ServiceRequestCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceRequestCreateManyUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ServiceRequestUncheckedCreateNestedManyWithoutUserInputObjectSchema: z.ZodType<Prisma.ServiceRequestUncheckedCreateNestedManyWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUncheckedCreateNestedManyWithoutUserInput>;
export const ServiceRequestUncheckedCreateNestedManyWithoutUserInputObjectZodSchema = makeSchema();

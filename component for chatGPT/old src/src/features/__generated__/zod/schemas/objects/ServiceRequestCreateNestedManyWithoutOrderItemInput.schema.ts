import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutOrderItemInputObjectSchema as ServiceRequestCreateWithoutOrderItemInputObjectSchema } from './ServiceRequestCreateWithoutOrderItemInput.schema';
import { ServiceRequestUncheckedCreateWithoutOrderItemInputObjectSchema as ServiceRequestUncheckedCreateWithoutOrderItemInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutOrderItemInput.schema';
import { ServiceRequestCreateOrConnectWithoutOrderItemInputObjectSchema as ServiceRequestCreateOrConnectWithoutOrderItemInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutOrderItemInput.schema';
import { ServiceRequestCreateManyOrderItemInputEnvelopeObjectSchema as ServiceRequestCreateManyOrderItemInputEnvelopeObjectSchema } from './ServiceRequestCreateManyOrderItemInputEnvelope.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceRequestCreateWithoutOrderItemInputObjectSchema).array(), z.lazy(() => ServiceRequestUncheckedCreateWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutOrderItemInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceRequestCreateOrConnectWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceRequestCreateOrConnectWithoutOrderItemInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceRequestCreateManyOrderItemInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateNestedManyWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateNestedManyWithoutOrderItemInput>;
export const ServiceRequestCreateNestedManyWithoutOrderItemInputObjectZodSchema = makeSchema();

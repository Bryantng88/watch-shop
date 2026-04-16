import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestCreateWithoutUserInputObjectSchema as ServiceRequestCreateWithoutUserInputObjectSchema } from './ServiceRequestCreateWithoutUserInput.schema';
import { ServiceRequestUncheckedCreateWithoutUserInputObjectSchema as ServiceRequestUncheckedCreateWithoutUserInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutUserInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const ServiceRequestCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutUserInput>;
export const ServiceRequestCreateOrConnectWithoutUserInputObjectZodSchema = makeSchema();

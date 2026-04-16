import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestScalarWhereInputObjectSchema as ServiceRequestScalarWhereInputObjectSchema } from './ServiceRequestScalarWhereInput.schema';
import { ServiceRequestUpdateManyMutationInputObjectSchema as ServiceRequestUpdateManyMutationInputObjectSchema } from './ServiceRequestUpdateManyMutationInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutUserInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutUserInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ServiceRequestUpdateManyMutationInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutUserInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateManyWithWhereWithoutUserInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateManyWithWhereWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateManyWithWhereWithoutUserInput>;
export const ServiceRequestUpdateManyWithWhereWithoutUserInputObjectZodSchema = makeSchema();

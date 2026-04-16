import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithoutUserInputObjectSchema as ServiceRequestUpdateWithoutUserInputObjectSchema } from './ServiceRequestUpdateWithoutUserInput.schema';
import { ServiceRequestUncheckedUpdateWithoutUserInputObjectSchema as ServiceRequestUncheckedUpdateWithoutUserInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ServiceRequestUpdateWithoutUserInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateWithWhereUniqueWithoutUserInput>;
export const ServiceRequestUpdateWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();

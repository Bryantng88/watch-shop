import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithoutUserInputObjectSchema as ServiceRequestUpdateWithoutUserInputObjectSchema } from './ServiceRequestUpdateWithoutUserInput.schema';
import { ServiceRequestUncheckedUpdateWithoutUserInputObjectSchema as ServiceRequestUncheckedUpdateWithoutUserInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutUserInput.schema';
import { ServiceRequestCreateWithoutUserInputObjectSchema as ServiceRequestCreateWithoutUserInputObjectSchema } from './ServiceRequestCreateWithoutUserInput.schema';
import { ServiceRequestUncheckedCreateWithoutUserInputObjectSchema as ServiceRequestUncheckedCreateWithoutUserInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ServiceRequestUpdateWithoutUserInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutUserInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const ServiceRequestUpsertWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpsertWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpsertWithWhereUniqueWithoutUserInput>;
export const ServiceRequestUpsertWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();

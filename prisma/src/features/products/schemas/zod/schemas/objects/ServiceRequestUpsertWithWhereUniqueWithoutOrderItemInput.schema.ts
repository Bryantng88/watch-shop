import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithoutOrderItemInputObjectSchema as ServiceRequestUpdateWithoutOrderItemInputObjectSchema } from './ServiceRequestUpdateWithoutOrderItemInput.schema';
import { ServiceRequestUncheckedUpdateWithoutOrderItemInputObjectSchema as ServiceRequestUncheckedUpdateWithoutOrderItemInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutOrderItemInput.schema';
import { ServiceRequestCreateWithoutOrderItemInputObjectSchema as ServiceRequestCreateWithoutOrderItemInputObjectSchema } from './ServiceRequestCreateWithoutOrderItemInput.schema';
import { ServiceRequestUncheckedCreateWithoutOrderItemInputObjectSchema as ServiceRequestUncheckedCreateWithoutOrderItemInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ServiceRequestUpdateWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutOrderItemInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutOrderItemInputObjectSchema)])
}).strict();
export const ServiceRequestUpsertWithWhereUniqueWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpsertWithWhereUniqueWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpsertWithWhereUniqueWithoutOrderItemInput>;
export const ServiceRequestUpsertWithWhereUniqueWithoutOrderItemInputObjectZodSchema = makeSchema();

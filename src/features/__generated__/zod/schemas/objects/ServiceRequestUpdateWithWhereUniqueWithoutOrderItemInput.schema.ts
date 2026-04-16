import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithoutOrderItemInputObjectSchema as ServiceRequestUpdateWithoutOrderItemInputObjectSchema } from './ServiceRequestUpdateWithoutOrderItemInput.schema';
import { ServiceRequestUncheckedUpdateWithoutOrderItemInputObjectSchema as ServiceRequestUncheckedUpdateWithoutOrderItemInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ServiceRequestUpdateWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutOrderItemInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateWithWhereUniqueWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateWithWhereUniqueWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateWithWhereUniqueWithoutOrderItemInput>;
export const ServiceRequestUpdateWithWhereUniqueWithoutOrderItemInputObjectZodSchema = makeSchema();

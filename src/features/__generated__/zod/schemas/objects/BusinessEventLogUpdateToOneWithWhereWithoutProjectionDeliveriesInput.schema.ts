import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BusinessEventLogWhereInputObjectSchema as BusinessEventLogWhereInputObjectSchema } from './BusinessEventLogWhereInput.schema';
import { BusinessEventLogUpdateWithoutProjectionDeliveriesInputObjectSchema as BusinessEventLogUpdateWithoutProjectionDeliveriesInputObjectSchema } from './BusinessEventLogUpdateWithoutProjectionDeliveriesInput.schema';
import { BusinessEventLogUncheckedUpdateWithoutProjectionDeliveriesInputObjectSchema as BusinessEventLogUncheckedUpdateWithoutProjectionDeliveriesInputObjectSchema } from './BusinessEventLogUncheckedUpdateWithoutProjectionDeliveriesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BusinessEventLogWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => BusinessEventLogUpdateWithoutProjectionDeliveriesInputObjectSchema), z.lazy(() => BusinessEventLogUncheckedUpdateWithoutProjectionDeliveriesInputObjectSchema)])
}).strict();
export const BusinessEventLogUpdateToOneWithWhereWithoutProjectionDeliveriesInputObjectSchema: z.ZodType<Prisma.BusinessEventLogUpdateToOneWithWhereWithoutProjectionDeliveriesInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogUpdateToOneWithWhereWithoutProjectionDeliveriesInput>;
export const BusinessEventLogUpdateToOneWithWhereWithoutProjectionDeliveriesInputObjectZodSchema = makeSchema();

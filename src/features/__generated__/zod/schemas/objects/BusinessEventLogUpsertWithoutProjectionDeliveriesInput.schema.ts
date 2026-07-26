import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BusinessEventLogUpdateWithoutProjectionDeliveriesInputObjectSchema as BusinessEventLogUpdateWithoutProjectionDeliveriesInputObjectSchema } from './BusinessEventLogUpdateWithoutProjectionDeliveriesInput.schema';
import { BusinessEventLogUncheckedUpdateWithoutProjectionDeliveriesInputObjectSchema as BusinessEventLogUncheckedUpdateWithoutProjectionDeliveriesInputObjectSchema } from './BusinessEventLogUncheckedUpdateWithoutProjectionDeliveriesInput.schema';
import { BusinessEventLogCreateWithoutProjectionDeliveriesInputObjectSchema as BusinessEventLogCreateWithoutProjectionDeliveriesInputObjectSchema } from './BusinessEventLogCreateWithoutProjectionDeliveriesInput.schema';
import { BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInputObjectSchema as BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInputObjectSchema } from './BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInput.schema';
import { BusinessEventLogWhereInputObjectSchema as BusinessEventLogWhereInputObjectSchema } from './BusinessEventLogWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => BusinessEventLogUpdateWithoutProjectionDeliveriesInputObjectSchema), z.lazy(() => BusinessEventLogUncheckedUpdateWithoutProjectionDeliveriesInputObjectSchema)]),
  create: z.union([z.lazy(() => BusinessEventLogCreateWithoutProjectionDeliveriesInputObjectSchema), z.lazy(() => BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInputObjectSchema)]),
  where: z.lazy(() => BusinessEventLogWhereInputObjectSchema).optional()
}).strict();
export const BusinessEventLogUpsertWithoutProjectionDeliveriesInputObjectSchema: z.ZodType<Prisma.BusinessEventLogUpsertWithoutProjectionDeliveriesInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogUpsertWithoutProjectionDeliveriesInput>;
export const BusinessEventLogUpsertWithoutProjectionDeliveriesInputObjectZodSchema = makeSchema();

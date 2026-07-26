import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BusinessEventLogWhereUniqueInputObjectSchema as BusinessEventLogWhereUniqueInputObjectSchema } from './BusinessEventLogWhereUniqueInput.schema';
import { BusinessEventLogCreateWithoutProjectionDeliveriesInputObjectSchema as BusinessEventLogCreateWithoutProjectionDeliveriesInputObjectSchema } from './BusinessEventLogCreateWithoutProjectionDeliveriesInput.schema';
import { BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInputObjectSchema as BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInputObjectSchema } from './BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BusinessEventLogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BusinessEventLogCreateWithoutProjectionDeliveriesInputObjectSchema), z.lazy(() => BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInputObjectSchema)])
}).strict();
export const BusinessEventLogCreateOrConnectWithoutProjectionDeliveriesInputObjectSchema: z.ZodType<Prisma.BusinessEventLogCreateOrConnectWithoutProjectionDeliveriesInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogCreateOrConnectWithoutProjectionDeliveriesInput>;
export const BusinessEventLogCreateOrConnectWithoutProjectionDeliveriesInputObjectZodSchema = makeSchema();

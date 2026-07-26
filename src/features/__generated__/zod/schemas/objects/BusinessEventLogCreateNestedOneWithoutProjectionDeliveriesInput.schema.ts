import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BusinessEventLogCreateWithoutProjectionDeliveriesInputObjectSchema as BusinessEventLogCreateWithoutProjectionDeliveriesInputObjectSchema } from './BusinessEventLogCreateWithoutProjectionDeliveriesInput.schema';
import { BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInputObjectSchema as BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInputObjectSchema } from './BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInput.schema';
import { BusinessEventLogCreateOrConnectWithoutProjectionDeliveriesInputObjectSchema as BusinessEventLogCreateOrConnectWithoutProjectionDeliveriesInputObjectSchema } from './BusinessEventLogCreateOrConnectWithoutProjectionDeliveriesInput.schema';
import { BusinessEventLogWhereUniqueInputObjectSchema as BusinessEventLogWhereUniqueInputObjectSchema } from './BusinessEventLogWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BusinessEventLogCreateWithoutProjectionDeliveriesInputObjectSchema), z.lazy(() => BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BusinessEventLogCreateOrConnectWithoutProjectionDeliveriesInputObjectSchema).optional(),
  connect: z.lazy(() => BusinessEventLogWhereUniqueInputObjectSchema).optional()
}).strict();
export const BusinessEventLogCreateNestedOneWithoutProjectionDeliveriesInputObjectSchema: z.ZodType<Prisma.BusinessEventLogCreateNestedOneWithoutProjectionDeliveriesInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogCreateNestedOneWithoutProjectionDeliveriesInput>;
export const BusinessEventLogCreateNestedOneWithoutProjectionDeliveriesInputObjectZodSchema = makeSchema();

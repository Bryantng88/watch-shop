import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BusinessEventLogCreateWithoutProjectionDeliveriesInputObjectSchema as BusinessEventLogCreateWithoutProjectionDeliveriesInputObjectSchema } from './BusinessEventLogCreateWithoutProjectionDeliveriesInput.schema';
import { BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInputObjectSchema as BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInputObjectSchema } from './BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInput.schema';
import { BusinessEventLogCreateOrConnectWithoutProjectionDeliveriesInputObjectSchema as BusinessEventLogCreateOrConnectWithoutProjectionDeliveriesInputObjectSchema } from './BusinessEventLogCreateOrConnectWithoutProjectionDeliveriesInput.schema';
import { BusinessEventLogUpsertWithoutProjectionDeliveriesInputObjectSchema as BusinessEventLogUpsertWithoutProjectionDeliveriesInputObjectSchema } from './BusinessEventLogUpsertWithoutProjectionDeliveriesInput.schema';
import { BusinessEventLogWhereInputObjectSchema as BusinessEventLogWhereInputObjectSchema } from './BusinessEventLogWhereInput.schema';
import { BusinessEventLogWhereUniqueInputObjectSchema as BusinessEventLogWhereUniqueInputObjectSchema } from './BusinessEventLogWhereUniqueInput.schema';
import { BusinessEventLogUpdateToOneWithWhereWithoutProjectionDeliveriesInputObjectSchema as BusinessEventLogUpdateToOneWithWhereWithoutProjectionDeliveriesInputObjectSchema } from './BusinessEventLogUpdateToOneWithWhereWithoutProjectionDeliveriesInput.schema';
import { BusinessEventLogUpdateWithoutProjectionDeliveriesInputObjectSchema as BusinessEventLogUpdateWithoutProjectionDeliveriesInputObjectSchema } from './BusinessEventLogUpdateWithoutProjectionDeliveriesInput.schema';
import { BusinessEventLogUncheckedUpdateWithoutProjectionDeliveriesInputObjectSchema as BusinessEventLogUncheckedUpdateWithoutProjectionDeliveriesInputObjectSchema } from './BusinessEventLogUncheckedUpdateWithoutProjectionDeliveriesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BusinessEventLogCreateWithoutProjectionDeliveriesInputObjectSchema), z.lazy(() => BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BusinessEventLogCreateOrConnectWithoutProjectionDeliveriesInputObjectSchema).optional(),
  upsert: z.lazy(() => BusinessEventLogUpsertWithoutProjectionDeliveriesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => BusinessEventLogWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => BusinessEventLogWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => BusinessEventLogWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => BusinessEventLogUpdateToOneWithWhereWithoutProjectionDeliveriesInputObjectSchema), z.lazy(() => BusinessEventLogUpdateWithoutProjectionDeliveriesInputObjectSchema), z.lazy(() => BusinessEventLogUncheckedUpdateWithoutProjectionDeliveriesInputObjectSchema)]).optional()
}).strict();
export const BusinessEventLogUpdateOneWithoutProjectionDeliveriesNestedInputObjectSchema: z.ZodType<Prisma.BusinessEventLogUpdateOneWithoutProjectionDeliveriesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogUpdateOneWithoutProjectionDeliveriesNestedInput>;
export const BusinessEventLogUpdateOneWithoutProjectionDeliveriesNestedInputObjectZodSchema = makeSchema();

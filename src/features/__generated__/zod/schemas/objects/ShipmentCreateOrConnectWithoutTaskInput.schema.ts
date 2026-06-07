import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema';
import { ShipmentCreateWithoutTaskInputObjectSchema as ShipmentCreateWithoutTaskInputObjectSchema } from './ShipmentCreateWithoutTaskInput.schema';
import { ShipmentUncheckedCreateWithoutTaskInputObjectSchema as ShipmentUncheckedCreateWithoutTaskInputObjectSchema } from './ShipmentUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ShipmentCreateWithoutTaskInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const ShipmentCreateOrConnectWithoutTaskInputObjectSchema: z.ZodType<Prisma.ShipmentCreateOrConnectWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCreateOrConnectWithoutTaskInput>;
export const ShipmentCreateOrConnectWithoutTaskInputObjectZodSchema = makeSchema();

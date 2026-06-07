import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCreateWithoutTaskInputObjectSchema as ShipmentCreateWithoutTaskInputObjectSchema } from './ShipmentCreateWithoutTaskInput.schema';
import { ShipmentUncheckedCreateWithoutTaskInputObjectSchema as ShipmentUncheckedCreateWithoutTaskInputObjectSchema } from './ShipmentUncheckedCreateWithoutTaskInput.schema';
import { ShipmentCreateOrConnectWithoutTaskInputObjectSchema as ShipmentCreateOrConnectWithoutTaskInputObjectSchema } from './ShipmentCreateOrConnectWithoutTaskInput.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ShipmentCreateWithoutTaskInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutTaskInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ShipmentCreateOrConnectWithoutTaskInputObjectSchema).optional(),
  connect: z.lazy(() => ShipmentWhereUniqueInputObjectSchema).optional()
}).strict();
export const ShipmentCreateNestedOneWithoutTaskInputObjectSchema: z.ZodType<Prisma.ShipmentCreateNestedOneWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCreateNestedOneWithoutTaskInput>;
export const ShipmentCreateNestedOneWithoutTaskInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentUpdateWithoutTaskInputObjectSchema as ShipmentUpdateWithoutTaskInputObjectSchema } from './ShipmentUpdateWithoutTaskInput.schema';
import { ShipmentUncheckedUpdateWithoutTaskInputObjectSchema as ShipmentUncheckedUpdateWithoutTaskInputObjectSchema } from './ShipmentUncheckedUpdateWithoutTaskInput.schema';
import { ShipmentCreateWithoutTaskInputObjectSchema as ShipmentCreateWithoutTaskInputObjectSchema } from './ShipmentCreateWithoutTaskInput.schema';
import { ShipmentUncheckedCreateWithoutTaskInputObjectSchema as ShipmentUncheckedCreateWithoutTaskInputObjectSchema } from './ShipmentUncheckedCreateWithoutTaskInput.schema';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ShipmentUpdateWithoutTaskInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutTaskInputObjectSchema)]),
  create: z.union([z.lazy(() => ShipmentCreateWithoutTaskInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutTaskInputObjectSchema)]),
  where: z.lazy(() => ShipmentWhereInputObjectSchema).optional()
}).strict();
export const ShipmentUpsertWithoutTaskInputObjectSchema: z.ZodType<Prisma.ShipmentUpsertWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpsertWithoutTaskInput>;
export const ShipmentUpsertWithoutTaskInputObjectZodSchema = makeSchema();

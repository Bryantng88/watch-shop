import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema';
import { ShipmentUpdateWithoutTaskInputObjectSchema as ShipmentUpdateWithoutTaskInputObjectSchema } from './ShipmentUpdateWithoutTaskInput.schema';
import { ShipmentUncheckedUpdateWithoutTaskInputObjectSchema as ShipmentUncheckedUpdateWithoutTaskInputObjectSchema } from './ShipmentUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ShipmentUpdateWithoutTaskInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutTaskInputObjectSchema)])
}).strict();
export const ShipmentUpdateToOneWithWhereWithoutTaskInputObjectSchema: z.ZodType<Prisma.ShipmentUpdateToOneWithWhereWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpdateToOneWithWhereWithoutTaskInput>;
export const ShipmentUpdateToOneWithWhereWithoutTaskInputObjectZodSchema = makeSchema();

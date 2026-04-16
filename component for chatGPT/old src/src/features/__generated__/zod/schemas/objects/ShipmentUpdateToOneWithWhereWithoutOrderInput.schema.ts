import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema';
import { ShipmentUpdateWithoutOrderInputObjectSchema as ShipmentUpdateWithoutOrderInputObjectSchema } from './ShipmentUpdateWithoutOrderInput.schema';
import { ShipmentUncheckedUpdateWithoutOrderInputObjectSchema as ShipmentUncheckedUpdateWithoutOrderInputObjectSchema } from './ShipmentUncheckedUpdateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ShipmentUpdateWithoutOrderInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutOrderInputObjectSchema)])
}).strict();
export const ShipmentUpdateToOneWithWhereWithoutOrderInputObjectSchema: z.ZodType<Prisma.ShipmentUpdateToOneWithWhereWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpdateToOneWithWhereWithoutOrderInput>;
export const ShipmentUpdateToOneWithWhereWithoutOrderInputObjectZodSchema = makeSchema();

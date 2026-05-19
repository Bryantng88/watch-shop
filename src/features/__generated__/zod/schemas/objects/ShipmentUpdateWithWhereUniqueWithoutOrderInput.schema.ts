import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema';
import { ShipmentUpdateWithoutOrderInputObjectSchema as ShipmentUpdateWithoutOrderInputObjectSchema } from './ShipmentUpdateWithoutOrderInput.schema';
import { ShipmentUncheckedUpdateWithoutOrderInputObjectSchema as ShipmentUncheckedUpdateWithoutOrderInputObjectSchema } from './ShipmentUncheckedUpdateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ShipmentUpdateWithoutOrderInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutOrderInputObjectSchema)])
}).strict();
export const ShipmentUpdateWithWhereUniqueWithoutOrderInputObjectSchema: z.ZodType<Prisma.ShipmentUpdateWithWhereUniqueWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpdateWithWhereUniqueWithoutOrderInput>;
export const ShipmentUpdateWithWhereUniqueWithoutOrderInputObjectZodSchema = makeSchema();

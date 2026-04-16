import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentUpdateWithoutOrderInputObjectSchema as ShipmentUpdateWithoutOrderInputObjectSchema } from './ShipmentUpdateWithoutOrderInput.schema';
import { ShipmentUncheckedUpdateWithoutOrderInputObjectSchema as ShipmentUncheckedUpdateWithoutOrderInputObjectSchema } from './ShipmentUncheckedUpdateWithoutOrderInput.schema';
import { ShipmentCreateWithoutOrderInputObjectSchema as ShipmentCreateWithoutOrderInputObjectSchema } from './ShipmentCreateWithoutOrderInput.schema';
import { ShipmentUncheckedCreateWithoutOrderInputObjectSchema as ShipmentUncheckedCreateWithoutOrderInputObjectSchema } from './ShipmentUncheckedCreateWithoutOrderInput.schema';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ShipmentUpdateWithoutOrderInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutOrderInputObjectSchema)]),
  create: z.union([z.lazy(() => ShipmentCreateWithoutOrderInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutOrderInputObjectSchema)]),
  where: z.lazy(() => ShipmentWhereInputObjectSchema).optional()
}).strict();
export const ShipmentUpsertWithoutOrderInputObjectSchema: z.ZodType<Prisma.ShipmentUpsertWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpsertWithoutOrderInput>;
export const ShipmentUpsertWithoutOrderInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema';
import { ShipmentUpdateWithoutOrderInputObjectSchema as ShipmentUpdateWithoutOrderInputObjectSchema } from './ShipmentUpdateWithoutOrderInput.schema';
import { ShipmentUncheckedUpdateWithoutOrderInputObjectSchema as ShipmentUncheckedUpdateWithoutOrderInputObjectSchema } from './ShipmentUncheckedUpdateWithoutOrderInput.schema';
import { ShipmentCreateWithoutOrderInputObjectSchema as ShipmentCreateWithoutOrderInputObjectSchema } from './ShipmentCreateWithoutOrderInput.schema';
import { ShipmentUncheckedCreateWithoutOrderInputObjectSchema as ShipmentUncheckedCreateWithoutOrderInputObjectSchema } from './ShipmentUncheckedCreateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ShipmentUpdateWithoutOrderInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutOrderInputObjectSchema)]),
  create: z.union([z.lazy(() => ShipmentCreateWithoutOrderInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutOrderInputObjectSchema)])
}).strict();
export const ShipmentUpsertWithWhereUniqueWithoutOrderInputObjectSchema: z.ZodType<Prisma.ShipmentUpsertWithWhereUniqueWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpsertWithWhereUniqueWithoutOrderInput>;
export const ShipmentUpsertWithWhereUniqueWithoutOrderInputObjectZodSchema = makeSchema();

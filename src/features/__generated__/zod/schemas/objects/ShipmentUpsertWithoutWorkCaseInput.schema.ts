import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentUpdateWithoutWorkCaseInputObjectSchema as ShipmentUpdateWithoutWorkCaseInputObjectSchema } from './ShipmentUpdateWithoutWorkCaseInput.schema';
import { ShipmentUncheckedUpdateWithoutWorkCaseInputObjectSchema as ShipmentUncheckedUpdateWithoutWorkCaseInputObjectSchema } from './ShipmentUncheckedUpdateWithoutWorkCaseInput.schema';
import { ShipmentCreateWithoutWorkCaseInputObjectSchema as ShipmentCreateWithoutWorkCaseInputObjectSchema } from './ShipmentCreateWithoutWorkCaseInput.schema';
import { ShipmentUncheckedCreateWithoutWorkCaseInputObjectSchema as ShipmentUncheckedCreateWithoutWorkCaseInputObjectSchema } from './ShipmentUncheckedCreateWithoutWorkCaseInput.schema';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ShipmentUpdateWithoutWorkCaseInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutWorkCaseInputObjectSchema)]),
  create: z.union([z.lazy(() => ShipmentCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutWorkCaseInputObjectSchema)]),
  where: z.lazy(() => ShipmentWhereInputObjectSchema).optional()
}).strict();
export const ShipmentUpsertWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.ShipmentUpsertWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpsertWithoutWorkCaseInput>;
export const ShipmentUpsertWithoutWorkCaseInputObjectZodSchema = makeSchema();

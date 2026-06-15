import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema';
import { ShipmentUpdateWithoutWorkCaseInputObjectSchema as ShipmentUpdateWithoutWorkCaseInputObjectSchema } from './ShipmentUpdateWithoutWorkCaseInput.schema';
import { ShipmentUncheckedUpdateWithoutWorkCaseInputObjectSchema as ShipmentUncheckedUpdateWithoutWorkCaseInputObjectSchema } from './ShipmentUncheckedUpdateWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ShipmentUpdateWithoutWorkCaseInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutWorkCaseInputObjectSchema)])
}).strict();
export const ShipmentUpdateToOneWithWhereWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.ShipmentUpdateToOneWithWhereWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpdateToOneWithWhereWithoutWorkCaseInput>;
export const ShipmentUpdateToOneWithWhereWithoutWorkCaseInputObjectZodSchema = makeSchema();

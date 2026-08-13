import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema';
import { ShipmentUpdateWithoutPackagesInputObjectSchema as ShipmentUpdateWithoutPackagesInputObjectSchema } from './ShipmentUpdateWithoutPackagesInput.schema';
import { ShipmentUncheckedUpdateWithoutPackagesInputObjectSchema as ShipmentUncheckedUpdateWithoutPackagesInputObjectSchema } from './ShipmentUncheckedUpdateWithoutPackagesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ShipmentUpdateWithoutPackagesInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutPackagesInputObjectSchema)])
}).strict();
export const ShipmentUpdateToOneWithWhereWithoutPackagesInputObjectSchema: z.ZodType<Prisma.ShipmentUpdateToOneWithWhereWithoutPackagesInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpdateToOneWithWhereWithoutPackagesInput>;
export const ShipmentUpdateToOneWithWhereWithoutPackagesInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentUpdateWithoutPackagesInputObjectSchema as ShipmentUpdateWithoutPackagesInputObjectSchema } from './ShipmentUpdateWithoutPackagesInput.schema';
import { ShipmentUncheckedUpdateWithoutPackagesInputObjectSchema as ShipmentUncheckedUpdateWithoutPackagesInputObjectSchema } from './ShipmentUncheckedUpdateWithoutPackagesInput.schema';
import { ShipmentCreateWithoutPackagesInputObjectSchema as ShipmentCreateWithoutPackagesInputObjectSchema } from './ShipmentCreateWithoutPackagesInput.schema';
import { ShipmentUncheckedCreateWithoutPackagesInputObjectSchema as ShipmentUncheckedCreateWithoutPackagesInputObjectSchema } from './ShipmentUncheckedCreateWithoutPackagesInput.schema';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ShipmentUpdateWithoutPackagesInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutPackagesInputObjectSchema)]),
  create: z.union([z.lazy(() => ShipmentCreateWithoutPackagesInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutPackagesInputObjectSchema)]),
  where: z.lazy(() => ShipmentWhereInputObjectSchema).optional()
}).strict();
export const ShipmentUpsertWithoutPackagesInputObjectSchema: z.ZodType<Prisma.ShipmentUpsertWithoutPackagesInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpsertWithoutPackagesInput>;
export const ShipmentUpsertWithoutPackagesInputObjectZodSchema = makeSchema();

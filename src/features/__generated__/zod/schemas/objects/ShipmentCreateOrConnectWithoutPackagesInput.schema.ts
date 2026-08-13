import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema';
import { ShipmentCreateWithoutPackagesInputObjectSchema as ShipmentCreateWithoutPackagesInputObjectSchema } from './ShipmentCreateWithoutPackagesInput.schema';
import { ShipmentUncheckedCreateWithoutPackagesInputObjectSchema as ShipmentUncheckedCreateWithoutPackagesInputObjectSchema } from './ShipmentUncheckedCreateWithoutPackagesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ShipmentCreateWithoutPackagesInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutPackagesInputObjectSchema)])
}).strict();
export const ShipmentCreateOrConnectWithoutPackagesInputObjectSchema: z.ZodType<Prisma.ShipmentCreateOrConnectWithoutPackagesInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCreateOrConnectWithoutPackagesInput>;
export const ShipmentCreateOrConnectWithoutPackagesInputObjectZodSchema = makeSchema();

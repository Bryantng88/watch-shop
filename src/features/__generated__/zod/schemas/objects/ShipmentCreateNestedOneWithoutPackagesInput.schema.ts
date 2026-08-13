import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCreateWithoutPackagesInputObjectSchema as ShipmentCreateWithoutPackagesInputObjectSchema } from './ShipmentCreateWithoutPackagesInput.schema';
import { ShipmentUncheckedCreateWithoutPackagesInputObjectSchema as ShipmentUncheckedCreateWithoutPackagesInputObjectSchema } from './ShipmentUncheckedCreateWithoutPackagesInput.schema';
import { ShipmentCreateOrConnectWithoutPackagesInputObjectSchema as ShipmentCreateOrConnectWithoutPackagesInputObjectSchema } from './ShipmentCreateOrConnectWithoutPackagesInput.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ShipmentCreateWithoutPackagesInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutPackagesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ShipmentCreateOrConnectWithoutPackagesInputObjectSchema).optional(),
  connect: z.lazy(() => ShipmentWhereUniqueInputObjectSchema).optional()
}).strict();
export const ShipmentCreateNestedOneWithoutPackagesInputObjectSchema: z.ZodType<Prisma.ShipmentCreateNestedOneWithoutPackagesInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCreateNestedOneWithoutPackagesInput>;
export const ShipmentCreateNestedOneWithoutPackagesInputObjectZodSchema = makeSchema();

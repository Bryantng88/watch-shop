import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCreateWithoutPackagesInputObjectSchema as ShipmentCreateWithoutPackagesInputObjectSchema } from './ShipmentCreateWithoutPackagesInput.schema';
import { ShipmentUncheckedCreateWithoutPackagesInputObjectSchema as ShipmentUncheckedCreateWithoutPackagesInputObjectSchema } from './ShipmentUncheckedCreateWithoutPackagesInput.schema';
import { ShipmentCreateOrConnectWithoutPackagesInputObjectSchema as ShipmentCreateOrConnectWithoutPackagesInputObjectSchema } from './ShipmentCreateOrConnectWithoutPackagesInput.schema';
import { ShipmentUpsertWithoutPackagesInputObjectSchema as ShipmentUpsertWithoutPackagesInputObjectSchema } from './ShipmentUpsertWithoutPackagesInput.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema';
import { ShipmentUpdateToOneWithWhereWithoutPackagesInputObjectSchema as ShipmentUpdateToOneWithWhereWithoutPackagesInputObjectSchema } from './ShipmentUpdateToOneWithWhereWithoutPackagesInput.schema';
import { ShipmentUpdateWithoutPackagesInputObjectSchema as ShipmentUpdateWithoutPackagesInputObjectSchema } from './ShipmentUpdateWithoutPackagesInput.schema';
import { ShipmentUncheckedUpdateWithoutPackagesInputObjectSchema as ShipmentUncheckedUpdateWithoutPackagesInputObjectSchema } from './ShipmentUncheckedUpdateWithoutPackagesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ShipmentCreateWithoutPackagesInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutPackagesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ShipmentCreateOrConnectWithoutPackagesInputObjectSchema).optional(),
  upsert: z.lazy(() => ShipmentUpsertWithoutPackagesInputObjectSchema).optional(),
  connect: z.lazy(() => ShipmentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ShipmentUpdateToOneWithWhereWithoutPackagesInputObjectSchema), z.lazy(() => ShipmentUpdateWithoutPackagesInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutPackagesInputObjectSchema)]).optional()
}).strict();
export const ShipmentUpdateOneRequiredWithoutPackagesNestedInputObjectSchema: z.ZodType<Prisma.ShipmentUpdateOneRequiredWithoutPackagesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpdateOneRequiredWithoutPackagesNestedInput>;
export const ShipmentUpdateOneRequiredWithoutPackagesNestedInputObjectZodSchema = makeSchema();

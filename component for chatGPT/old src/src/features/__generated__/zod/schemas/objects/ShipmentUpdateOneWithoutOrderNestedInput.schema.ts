import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCreateWithoutOrderInputObjectSchema as ShipmentCreateWithoutOrderInputObjectSchema } from './ShipmentCreateWithoutOrderInput.schema';
import { ShipmentUncheckedCreateWithoutOrderInputObjectSchema as ShipmentUncheckedCreateWithoutOrderInputObjectSchema } from './ShipmentUncheckedCreateWithoutOrderInput.schema';
import { ShipmentCreateOrConnectWithoutOrderInputObjectSchema as ShipmentCreateOrConnectWithoutOrderInputObjectSchema } from './ShipmentCreateOrConnectWithoutOrderInput.schema';
import { ShipmentUpsertWithoutOrderInputObjectSchema as ShipmentUpsertWithoutOrderInputObjectSchema } from './ShipmentUpsertWithoutOrderInput.schema';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema';
import { ShipmentUpdateToOneWithWhereWithoutOrderInputObjectSchema as ShipmentUpdateToOneWithWhereWithoutOrderInputObjectSchema } from './ShipmentUpdateToOneWithWhereWithoutOrderInput.schema';
import { ShipmentUpdateWithoutOrderInputObjectSchema as ShipmentUpdateWithoutOrderInputObjectSchema } from './ShipmentUpdateWithoutOrderInput.schema';
import { ShipmentUncheckedUpdateWithoutOrderInputObjectSchema as ShipmentUncheckedUpdateWithoutOrderInputObjectSchema } from './ShipmentUncheckedUpdateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ShipmentCreateWithoutOrderInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutOrderInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ShipmentCreateOrConnectWithoutOrderInputObjectSchema).optional(),
  upsert: z.lazy(() => ShipmentUpsertWithoutOrderInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ShipmentWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ShipmentWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ShipmentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ShipmentUpdateToOneWithWhereWithoutOrderInputObjectSchema), z.lazy(() => ShipmentUpdateWithoutOrderInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutOrderInputObjectSchema)]).optional()
}).strict();
export const ShipmentUpdateOneWithoutOrderNestedInputObjectSchema: z.ZodType<Prisma.ShipmentUpdateOneWithoutOrderNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpdateOneWithoutOrderNestedInput>;
export const ShipmentUpdateOneWithoutOrderNestedInputObjectZodSchema = makeSchema();

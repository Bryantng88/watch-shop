import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCreateWithoutTaskInputObjectSchema as ShipmentCreateWithoutTaskInputObjectSchema } from './ShipmentCreateWithoutTaskInput.schema';
import { ShipmentUncheckedCreateWithoutTaskInputObjectSchema as ShipmentUncheckedCreateWithoutTaskInputObjectSchema } from './ShipmentUncheckedCreateWithoutTaskInput.schema';
import { ShipmentCreateOrConnectWithoutTaskInputObjectSchema as ShipmentCreateOrConnectWithoutTaskInputObjectSchema } from './ShipmentCreateOrConnectWithoutTaskInput.schema';
import { ShipmentUpsertWithoutTaskInputObjectSchema as ShipmentUpsertWithoutTaskInputObjectSchema } from './ShipmentUpsertWithoutTaskInput.schema';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema';
import { ShipmentUpdateToOneWithWhereWithoutTaskInputObjectSchema as ShipmentUpdateToOneWithWhereWithoutTaskInputObjectSchema } from './ShipmentUpdateToOneWithWhereWithoutTaskInput.schema';
import { ShipmentUpdateWithoutTaskInputObjectSchema as ShipmentUpdateWithoutTaskInputObjectSchema } from './ShipmentUpdateWithoutTaskInput.schema';
import { ShipmentUncheckedUpdateWithoutTaskInputObjectSchema as ShipmentUncheckedUpdateWithoutTaskInputObjectSchema } from './ShipmentUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ShipmentCreateWithoutTaskInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutTaskInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ShipmentCreateOrConnectWithoutTaskInputObjectSchema).optional(),
  upsert: z.lazy(() => ShipmentUpsertWithoutTaskInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ShipmentWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ShipmentWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ShipmentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ShipmentUpdateToOneWithWhereWithoutTaskInputObjectSchema), z.lazy(() => ShipmentUpdateWithoutTaskInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutTaskInputObjectSchema)]).optional()
}).strict();
export const ShipmentUpdateOneWithoutTaskNestedInputObjectSchema: z.ZodType<Prisma.ShipmentUpdateOneWithoutTaskNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpdateOneWithoutTaskNestedInput>;
export const ShipmentUpdateOneWithoutTaskNestedInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCreateWithoutWorkCaseInputObjectSchema as ShipmentCreateWithoutWorkCaseInputObjectSchema } from './ShipmentCreateWithoutWorkCaseInput.schema';
import { ShipmentUncheckedCreateWithoutWorkCaseInputObjectSchema as ShipmentUncheckedCreateWithoutWorkCaseInputObjectSchema } from './ShipmentUncheckedCreateWithoutWorkCaseInput.schema';
import { ShipmentCreateOrConnectWithoutWorkCaseInputObjectSchema as ShipmentCreateOrConnectWithoutWorkCaseInputObjectSchema } from './ShipmentCreateOrConnectWithoutWorkCaseInput.schema';
import { ShipmentUpsertWithoutWorkCaseInputObjectSchema as ShipmentUpsertWithoutWorkCaseInputObjectSchema } from './ShipmentUpsertWithoutWorkCaseInput.schema';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema';
import { ShipmentUpdateToOneWithWhereWithoutWorkCaseInputObjectSchema as ShipmentUpdateToOneWithWhereWithoutWorkCaseInputObjectSchema } from './ShipmentUpdateToOneWithWhereWithoutWorkCaseInput.schema';
import { ShipmentUpdateWithoutWorkCaseInputObjectSchema as ShipmentUpdateWithoutWorkCaseInputObjectSchema } from './ShipmentUpdateWithoutWorkCaseInput.schema';
import { ShipmentUncheckedUpdateWithoutWorkCaseInputObjectSchema as ShipmentUncheckedUpdateWithoutWorkCaseInputObjectSchema } from './ShipmentUncheckedUpdateWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ShipmentCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutWorkCaseInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ShipmentCreateOrConnectWithoutWorkCaseInputObjectSchema).optional(),
  upsert: z.lazy(() => ShipmentUpsertWithoutWorkCaseInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ShipmentWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ShipmentWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ShipmentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ShipmentUpdateToOneWithWhereWithoutWorkCaseInputObjectSchema), z.lazy(() => ShipmentUpdateWithoutWorkCaseInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateWithoutWorkCaseInputObjectSchema)]).optional()
}).strict();
export const ShipmentUpdateOneWithoutWorkCaseNestedInputObjectSchema: z.ZodType<Prisma.ShipmentUpdateOneWithoutWorkCaseNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpdateOneWithoutWorkCaseNestedInput>;
export const ShipmentUpdateOneWithoutWorkCaseNestedInputObjectZodSchema = makeSchema();

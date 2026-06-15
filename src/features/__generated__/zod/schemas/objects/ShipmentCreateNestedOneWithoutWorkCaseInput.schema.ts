import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCreateWithoutWorkCaseInputObjectSchema as ShipmentCreateWithoutWorkCaseInputObjectSchema } from './ShipmentCreateWithoutWorkCaseInput.schema';
import { ShipmentUncheckedCreateWithoutWorkCaseInputObjectSchema as ShipmentUncheckedCreateWithoutWorkCaseInputObjectSchema } from './ShipmentUncheckedCreateWithoutWorkCaseInput.schema';
import { ShipmentCreateOrConnectWithoutWorkCaseInputObjectSchema as ShipmentCreateOrConnectWithoutWorkCaseInputObjectSchema } from './ShipmentCreateOrConnectWithoutWorkCaseInput.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ShipmentCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutWorkCaseInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ShipmentCreateOrConnectWithoutWorkCaseInputObjectSchema).optional(),
  connect: z.lazy(() => ShipmentWhereUniqueInputObjectSchema).optional()
}).strict();
export const ShipmentCreateNestedOneWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.ShipmentCreateNestedOneWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCreateNestedOneWithoutWorkCaseInput>;
export const ShipmentCreateNestedOneWithoutWorkCaseInputObjectZodSchema = makeSchema();

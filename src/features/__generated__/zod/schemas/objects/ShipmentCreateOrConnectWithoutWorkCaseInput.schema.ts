import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './ShipmentWhereUniqueInput.schema';
import { ShipmentCreateWithoutWorkCaseInputObjectSchema as ShipmentCreateWithoutWorkCaseInputObjectSchema } from './ShipmentCreateWithoutWorkCaseInput.schema';
import { ShipmentUncheckedCreateWithoutWorkCaseInputObjectSchema as ShipmentUncheckedCreateWithoutWorkCaseInputObjectSchema } from './ShipmentUncheckedCreateWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ShipmentCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => ShipmentUncheckedCreateWithoutWorkCaseInputObjectSchema)])
}).strict();
export const ShipmentCreateOrConnectWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.ShipmentCreateOrConnectWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCreateOrConnectWithoutWorkCaseInput>;
export const ShipmentCreateOrConnectWithoutWorkCaseInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemCreateWithoutSourceOrderItemInputObjectSchema as AcquisitionItemCreateWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemCreateWithoutSourceOrderItemInput.schema';
import { AcquisitionItemUncheckedCreateWithoutSourceOrderItemInputObjectSchema as AcquisitionItemUncheckedCreateWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutSourceOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutSourceOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutSourceOrderItemInputObjectSchema)])
}).strict();
export const AcquisitionItemCreateOrConnectWithoutSourceOrderItemInputObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateOrConnectWithoutSourceOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateOrConnectWithoutSourceOrderItemInput>;
export const AcquisitionItemCreateOrConnectWithoutSourceOrderItemInputObjectZodSchema = makeSchema();

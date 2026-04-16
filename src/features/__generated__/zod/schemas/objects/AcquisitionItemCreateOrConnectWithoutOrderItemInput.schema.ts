import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemCreateWithoutOrderItemInputObjectSchema as AcquisitionItemCreateWithoutOrderItemInputObjectSchema } from './AcquisitionItemCreateWithoutOrderItemInput.schema';
import { AcquisitionItemUncheckedCreateWithoutOrderItemInputObjectSchema as AcquisitionItemUncheckedCreateWithoutOrderItemInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutOrderItemInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutOrderItemInputObjectSchema)])
}).strict();
export const AcquisitionItemCreateOrConnectWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateOrConnectWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateOrConnectWithoutOrderItemInput>;
export const AcquisitionItemCreateOrConnectWithoutOrderItemInputObjectZodSchema = makeSchema();

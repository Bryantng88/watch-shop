import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemUpdateWithoutAcquisitionItemInputObjectSchema as OrderItemUpdateWithoutAcquisitionItemInputObjectSchema } from './OrderItemUpdateWithoutAcquisitionItemInput.schema';
import { OrderItemUncheckedUpdateWithoutAcquisitionItemInputObjectSchema as OrderItemUncheckedUpdateWithoutAcquisitionItemInputObjectSchema } from './OrderItemUncheckedUpdateWithoutAcquisitionItemInput.schema';
import { OrderItemCreateWithoutAcquisitionItemInputObjectSchema as OrderItemCreateWithoutAcquisitionItemInputObjectSchema } from './OrderItemCreateWithoutAcquisitionItemInput.schema';
import { OrderItemUncheckedCreateWithoutAcquisitionItemInputObjectSchema as OrderItemUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './OrderItemUncheckedCreateWithoutAcquisitionItemInput.schema';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './OrderItemWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => OrderItemUpdateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutAcquisitionItemInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderItemCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutAcquisitionItemInputObjectSchema)]),
  where: z.lazy(() => OrderItemWhereInputObjectSchema).optional()
}).strict();
export const OrderItemUpsertWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.OrderItemUpsertWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpsertWithoutAcquisitionItemInput>;
export const OrderItemUpsertWithoutAcquisitionItemInputObjectZodSchema = makeSchema();

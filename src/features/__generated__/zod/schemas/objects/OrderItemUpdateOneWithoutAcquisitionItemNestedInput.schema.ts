import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCreateWithoutAcquisitionItemInputObjectSchema as OrderItemCreateWithoutAcquisitionItemInputObjectSchema } from './OrderItemCreateWithoutAcquisitionItemInput.schema';
import { OrderItemUncheckedCreateWithoutAcquisitionItemInputObjectSchema as OrderItemUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './OrderItemUncheckedCreateWithoutAcquisitionItemInput.schema';
import { OrderItemCreateOrConnectWithoutAcquisitionItemInputObjectSchema as OrderItemCreateOrConnectWithoutAcquisitionItemInputObjectSchema } from './OrderItemCreateOrConnectWithoutAcquisitionItemInput.schema';
import { OrderItemUpsertWithoutAcquisitionItemInputObjectSchema as OrderItemUpsertWithoutAcquisitionItemInputObjectSchema } from './OrderItemUpsertWithoutAcquisitionItemInput.schema';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './OrderItemWhereInput.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema as OrderItemUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema } from './OrderItemUpdateToOneWithWhereWithoutAcquisitionItemInput.schema';
import { OrderItemUpdateWithoutAcquisitionItemInputObjectSchema as OrderItemUpdateWithoutAcquisitionItemInputObjectSchema } from './OrderItemUpdateWithoutAcquisitionItemInput.schema';
import { OrderItemUncheckedUpdateWithoutAcquisitionItemInputObjectSchema as OrderItemUncheckedUpdateWithoutAcquisitionItemInputObjectSchema } from './OrderItemUncheckedUpdateWithoutAcquisitionItemInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutAcquisitionItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderItemCreateOrConnectWithoutAcquisitionItemInputObjectSchema).optional(),
  upsert: z.lazy(() => OrderItemUpsertWithoutAcquisitionItemInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => OrderItemWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => OrderItemWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => OrderItemWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => OrderItemUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema), z.lazy(() => OrderItemUpdateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutAcquisitionItemInputObjectSchema)]).optional()
}).strict();
export const OrderItemUpdateOneWithoutAcquisitionItemNestedInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateOneWithoutAcquisitionItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateOneWithoutAcquisitionItemNestedInput>;
export const OrderItemUpdateOneWithoutAcquisitionItemNestedInputObjectZodSchema = makeSchema();

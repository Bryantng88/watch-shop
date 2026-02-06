import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCreateWithoutServiceRequestInputObjectSchema as OrderItemCreateWithoutServiceRequestInputObjectSchema } from './OrderItemCreateWithoutServiceRequestInput.schema';
import { OrderItemUncheckedCreateWithoutServiceRequestInputObjectSchema as OrderItemUncheckedCreateWithoutServiceRequestInputObjectSchema } from './OrderItemUncheckedCreateWithoutServiceRequestInput.schema';
import { OrderItemCreateOrConnectWithoutServiceRequestInputObjectSchema as OrderItemCreateOrConnectWithoutServiceRequestInputObjectSchema } from './OrderItemCreateOrConnectWithoutServiceRequestInput.schema';
import { OrderItemUpsertWithoutServiceRequestInputObjectSchema as OrderItemUpsertWithoutServiceRequestInputObjectSchema } from './OrderItemUpsertWithoutServiceRequestInput.schema';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './OrderItemWhereInput.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema as OrderItemUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema } from './OrderItemUpdateToOneWithWhereWithoutServiceRequestInput.schema';
import { OrderItemUpdateWithoutServiceRequestInputObjectSchema as OrderItemUpdateWithoutServiceRequestInputObjectSchema } from './OrderItemUpdateWithoutServiceRequestInput.schema';
import { OrderItemUncheckedUpdateWithoutServiceRequestInputObjectSchema as OrderItemUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './OrderItemUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutServiceRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderItemCreateOrConnectWithoutServiceRequestInputObjectSchema).optional(),
  upsert: z.lazy(() => OrderItemUpsertWithoutServiceRequestInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => OrderItemWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => OrderItemWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => OrderItemWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => OrderItemUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema), z.lazy(() => OrderItemUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutServiceRequestInputObjectSchema)]).optional()
}).strict();
export const OrderItemUpdateOneWithoutServiceRequestNestedInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateOneWithoutServiceRequestNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateOneWithoutServiceRequestNestedInput>;
export const OrderItemUpdateOneWithoutServiceRequestNestedInputObjectZodSchema = makeSchema();

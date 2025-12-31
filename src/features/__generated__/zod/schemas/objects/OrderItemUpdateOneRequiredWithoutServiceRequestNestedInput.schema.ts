import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCreateWithoutServiceRequestInputObjectSchema as OrderItemCreateWithoutServiceRequestInputObjectSchema } from './OrderItemCreateWithoutServiceRequestInput.schema';
import { OrderItemUncheckedCreateWithoutServiceRequestInputObjectSchema as OrderItemUncheckedCreateWithoutServiceRequestInputObjectSchema } from './OrderItemUncheckedCreateWithoutServiceRequestInput.schema';
import { OrderItemCreateOrConnectWithoutServiceRequestInputObjectSchema as OrderItemCreateOrConnectWithoutServiceRequestInputObjectSchema } from './OrderItemCreateOrConnectWithoutServiceRequestInput.schema';
import { OrderItemUpsertWithoutServiceRequestInputObjectSchema as OrderItemUpsertWithoutServiceRequestInputObjectSchema } from './OrderItemUpsertWithoutServiceRequestInput.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema as OrderItemUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema } from './OrderItemUpdateToOneWithWhereWithoutServiceRequestInput.schema';
import { OrderItemUpdateWithoutServiceRequestInputObjectSchema as OrderItemUpdateWithoutServiceRequestInputObjectSchema } from './OrderItemUpdateWithoutServiceRequestInput.schema';
import { OrderItemUncheckedUpdateWithoutServiceRequestInputObjectSchema as OrderItemUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './OrderItemUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutServiceRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderItemCreateOrConnectWithoutServiceRequestInputObjectSchema).optional(),
  upsert: z.lazy(() => OrderItemUpsertWithoutServiceRequestInputObjectSchema).optional(),
  connect: z.lazy(() => OrderItemWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => OrderItemUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema), z.lazy(() => OrderItemUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutServiceRequestInputObjectSchema)]).optional()
}).strict();
export const OrderItemUpdateOneRequiredWithoutServiceRequestNestedInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateOneRequiredWithoutServiceRequestNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateOneRequiredWithoutServiceRequestNestedInput>;
export const OrderItemUpdateOneRequiredWithoutServiceRequestNestedInputObjectZodSchema = makeSchema();

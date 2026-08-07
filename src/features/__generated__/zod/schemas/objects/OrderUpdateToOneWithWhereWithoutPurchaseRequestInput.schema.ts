import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { OrderUpdateWithoutPurchaseRequestInputObjectSchema as OrderUpdateWithoutPurchaseRequestInputObjectSchema } from './OrderUpdateWithoutPurchaseRequestInput.schema';
import { OrderUncheckedUpdateWithoutPurchaseRequestInputObjectSchema as OrderUncheckedUpdateWithoutPurchaseRequestInputObjectSchema } from './OrderUncheckedUpdateWithoutPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => OrderUpdateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutPurchaseRequestInputObjectSchema)])
}).strict();
export const OrderUpdateToOneWithWhereWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutPurchaseRequestInput>;
export const OrderUpdateToOneWithWhereWithoutPurchaseRequestInputObjectZodSchema = makeSchema();

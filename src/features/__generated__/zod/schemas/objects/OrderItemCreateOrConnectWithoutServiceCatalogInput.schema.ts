import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemCreateWithoutServiceCatalogInputObjectSchema as OrderItemCreateWithoutServiceCatalogInputObjectSchema } from './OrderItemCreateWithoutServiceCatalogInput.schema';
import { OrderItemUncheckedCreateWithoutServiceCatalogInputObjectSchema as OrderItemUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './OrderItemUncheckedCreateWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderItemCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const OrderItemCreateOrConnectWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.OrderItemCreateOrConnectWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateOrConnectWithoutServiceCatalogInput>;
export const OrderItemCreateOrConnectWithoutServiceCatalogInputObjectZodSchema = makeSchema();

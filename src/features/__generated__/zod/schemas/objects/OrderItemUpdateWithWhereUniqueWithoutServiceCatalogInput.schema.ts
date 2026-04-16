import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateWithoutServiceCatalogInputObjectSchema as OrderItemUpdateWithoutServiceCatalogInputObjectSchema } from './OrderItemUpdateWithoutServiceCatalogInput.schema';
import { OrderItemUncheckedUpdateWithoutServiceCatalogInputObjectSchema as OrderItemUncheckedUpdateWithoutServiceCatalogInputObjectSchema } from './OrderItemUncheckedUpdateWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => OrderItemUpdateWithoutServiceCatalogInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const OrderItemUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateWithWhereUniqueWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateWithWhereUniqueWithoutServiceCatalogInput>;
export const OrderItemUpdateWithWhereUniqueWithoutServiceCatalogInputObjectZodSchema = makeSchema();

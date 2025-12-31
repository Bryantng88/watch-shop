import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateWithoutServiceCatalogInputObjectSchema as OrderItemUpdateWithoutServiceCatalogInputObjectSchema } from './OrderItemUpdateWithoutServiceCatalogInput.schema';
import { OrderItemUncheckedUpdateWithoutServiceCatalogInputObjectSchema as OrderItemUncheckedUpdateWithoutServiceCatalogInputObjectSchema } from './OrderItemUncheckedUpdateWithoutServiceCatalogInput.schema';
import { OrderItemCreateWithoutServiceCatalogInputObjectSchema as OrderItemCreateWithoutServiceCatalogInputObjectSchema } from './OrderItemCreateWithoutServiceCatalogInput.schema';
import { OrderItemUncheckedCreateWithoutServiceCatalogInputObjectSchema as OrderItemUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './OrderItemUncheckedCreateWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => OrderItemUpdateWithoutServiceCatalogInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutServiceCatalogInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderItemCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const OrderItemUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.OrderItemUpsertWithWhereUniqueWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpsertWithWhereUniqueWithoutServiceCatalogInput>;
export const OrderItemUpsertWithWhereUniqueWithoutServiceCatalogInputObjectZodSchema = makeSchema();

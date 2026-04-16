import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemScalarWhereInputObjectSchema as OrderItemScalarWhereInputObjectSchema } from './OrderItemScalarWhereInput.schema';
import { OrderItemUpdateManyMutationInputObjectSchema as OrderItemUpdateManyMutationInputObjectSchema } from './OrderItemUpdateManyMutationInput.schema';
import { OrderItemUncheckedUpdateManyWithoutServiceCatalogInputObjectSchema as OrderItemUncheckedUpdateManyWithoutServiceCatalogInputObjectSchema } from './OrderItemUncheckedUpdateManyWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => OrderItemUpdateManyMutationInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateManyWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const OrderItemUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateManyWithWhereWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateManyWithWhereWithoutServiceCatalogInput>;
export const OrderItemUpdateManyWithWhereWithoutServiceCatalogInputObjectZodSchema = makeSchema();

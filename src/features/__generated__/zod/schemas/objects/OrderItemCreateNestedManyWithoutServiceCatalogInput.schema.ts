import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCreateWithoutServiceCatalogInputObjectSchema as OrderItemCreateWithoutServiceCatalogInputObjectSchema } from './OrderItemCreateWithoutServiceCatalogInput.schema';
import { OrderItemUncheckedCreateWithoutServiceCatalogInputObjectSchema as OrderItemUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './OrderItemUncheckedCreateWithoutServiceCatalogInput.schema';
import { OrderItemCreateOrConnectWithoutServiceCatalogInputObjectSchema as OrderItemCreateOrConnectWithoutServiceCatalogInputObjectSchema } from './OrderItemCreateOrConnectWithoutServiceCatalogInput.schema';
import { OrderItemCreateManyServiceCatalogInputEnvelopeObjectSchema as OrderItemCreateManyServiceCatalogInputEnvelopeObjectSchema } from './OrderItemCreateManyServiceCatalogInputEnvelope.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => OrderItemCreateWithoutServiceCatalogInputObjectSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => OrderItemCreateOrConnectWithoutServiceCatalogInputObjectSchema), z.lazy(() => OrderItemCreateOrConnectWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyServiceCatalogInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const OrderItemCreateNestedManyWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.OrderItemCreateNestedManyWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateNestedManyWithoutServiceCatalogInput>;
export const OrderItemCreateNestedManyWithoutServiceCatalogInputObjectZodSchema = makeSchema();

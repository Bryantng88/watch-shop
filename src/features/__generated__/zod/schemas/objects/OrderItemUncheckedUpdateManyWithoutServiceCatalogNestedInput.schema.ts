import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCreateWithoutServiceCatalogInputObjectSchema as OrderItemCreateWithoutServiceCatalogInputObjectSchema } from './OrderItemCreateWithoutServiceCatalogInput.schema';
import { OrderItemUncheckedCreateWithoutServiceCatalogInputObjectSchema as OrderItemUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './OrderItemUncheckedCreateWithoutServiceCatalogInput.schema';
import { OrderItemCreateOrConnectWithoutServiceCatalogInputObjectSchema as OrderItemCreateOrConnectWithoutServiceCatalogInputObjectSchema } from './OrderItemCreateOrConnectWithoutServiceCatalogInput.schema';
import { OrderItemUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema as OrderItemUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema } from './OrderItemUpsertWithWhereUniqueWithoutServiceCatalogInput.schema';
import { OrderItemCreateManyServiceCatalogInputEnvelopeObjectSchema as OrderItemCreateManyServiceCatalogInputEnvelopeObjectSchema } from './OrderItemCreateManyServiceCatalogInputEnvelope.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema as OrderItemUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema } from './OrderItemUpdateWithWhereUniqueWithoutServiceCatalogInput.schema';
import { OrderItemUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema as OrderItemUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema } from './OrderItemUpdateManyWithWhereWithoutServiceCatalogInput.schema';
import { OrderItemScalarWhereInputObjectSchema as OrderItemScalarWhereInputObjectSchema } from './OrderItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => OrderItemCreateWithoutServiceCatalogInputObjectSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => OrderItemCreateOrConnectWithoutServiceCatalogInputObjectSchema), z.lazy(() => OrderItemCreateOrConnectWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema), z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyServiceCatalogInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema), z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => OrderItemUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema), z.lazy(() => OrderItemUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => OrderItemScalarWhereInputObjectSchema), z.lazy(() => OrderItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const OrderItemUncheckedUpdateManyWithoutServiceCatalogNestedInputObjectSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateManyWithoutServiceCatalogNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUncheckedUpdateManyWithoutServiceCatalogNestedInput>;
export const OrderItemUncheckedUpdateManyWithoutServiceCatalogNestedInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutServiceRequestInputObjectSchema as ProductCreateWithoutServiceRequestInputObjectSchema } from './ProductCreateWithoutServiceRequestInput.schema';
import { ProductUncheckedCreateWithoutServiceRequestInputObjectSchema as ProductUncheckedCreateWithoutServiceRequestInputObjectSchema } from './ProductUncheckedCreateWithoutServiceRequestInput.schema';
import { ProductCreateOrConnectWithoutServiceRequestInputObjectSchema as ProductCreateOrConnectWithoutServiceRequestInputObjectSchema } from './ProductCreateOrConnectWithoutServiceRequestInput.schema';
import { ProductUpsertWithoutServiceRequestInputObjectSchema as ProductUpsertWithoutServiceRequestInputObjectSchema } from './ProductUpsertWithoutServiceRequestInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema as ProductUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutServiceRequestInput.schema';
import { ProductUpdateWithoutServiceRequestInputObjectSchema as ProductUpdateWithoutServiceRequestInputObjectSchema } from './ProductUpdateWithoutServiceRequestInput.schema';
import { ProductUncheckedUpdateWithoutServiceRequestInputObjectSchema as ProductUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './ProductUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutServiceRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutServiceRequestInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutServiceRequestInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema), z.lazy(() => ProductUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutServiceRequestInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneWithoutServiceRequestNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneWithoutServiceRequestNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneWithoutServiceRequestNestedInput>;
export const ProductUpdateOneWithoutServiceRequestNestedInputObjectZodSchema = makeSchema();

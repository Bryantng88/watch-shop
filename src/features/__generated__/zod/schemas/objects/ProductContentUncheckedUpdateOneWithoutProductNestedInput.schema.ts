import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductContentCreateWithoutProductInputObjectSchema as ProductContentCreateWithoutProductInputObjectSchema } from './ProductContentCreateWithoutProductInput.schema';
import { ProductContentUncheckedCreateWithoutProductInputObjectSchema as ProductContentUncheckedCreateWithoutProductInputObjectSchema } from './ProductContentUncheckedCreateWithoutProductInput.schema';
import { ProductContentCreateOrConnectWithoutProductInputObjectSchema as ProductContentCreateOrConnectWithoutProductInputObjectSchema } from './ProductContentCreateOrConnectWithoutProductInput.schema';
import { ProductContentUpsertWithoutProductInputObjectSchema as ProductContentUpsertWithoutProductInputObjectSchema } from './ProductContentUpsertWithoutProductInput.schema';
import { ProductContentWhereInputObjectSchema as ProductContentWhereInputObjectSchema } from './ProductContentWhereInput.schema';
import { ProductContentWhereUniqueInputObjectSchema as ProductContentWhereUniqueInputObjectSchema } from './ProductContentWhereUniqueInput.schema';
import { ProductContentUpdateToOneWithWhereWithoutProductInputObjectSchema as ProductContentUpdateToOneWithWhereWithoutProductInputObjectSchema } from './ProductContentUpdateToOneWithWhereWithoutProductInput.schema';
import { ProductContentUpdateWithoutProductInputObjectSchema as ProductContentUpdateWithoutProductInputObjectSchema } from './ProductContentUpdateWithoutProductInput.schema';
import { ProductContentUncheckedUpdateWithoutProductInputObjectSchema as ProductContentUncheckedUpdateWithoutProductInputObjectSchema } from './ProductContentUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductContentCreateWithoutProductInputObjectSchema), z.lazy(() => ProductContentUncheckedCreateWithoutProductInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductContentCreateOrConnectWithoutProductInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductContentUpsertWithoutProductInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProductContentWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProductContentWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProductContentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductContentUpdateToOneWithWhereWithoutProductInputObjectSchema), z.lazy(() => ProductContentUpdateWithoutProductInputObjectSchema), z.lazy(() => ProductContentUncheckedUpdateWithoutProductInputObjectSchema)]).optional()
}).strict();
export const ProductContentUncheckedUpdateOneWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.ProductContentUncheckedUpdateOneWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductContentUncheckedUpdateOneWithoutProductNestedInput>;
export const ProductContentUncheckedUpdateOneWithoutProductNestedInputObjectZodSchema = makeSchema();

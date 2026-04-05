import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutContentInputObjectSchema as ProductCreateWithoutContentInputObjectSchema } from './ProductCreateWithoutContentInput.schema';
import { ProductUncheckedCreateWithoutContentInputObjectSchema as ProductUncheckedCreateWithoutContentInputObjectSchema } from './ProductUncheckedCreateWithoutContentInput.schema';
import { ProductCreateOrConnectWithoutContentInputObjectSchema as ProductCreateOrConnectWithoutContentInputObjectSchema } from './ProductCreateOrConnectWithoutContentInput.schema';
import { ProductUpsertWithoutContentInputObjectSchema as ProductUpsertWithoutContentInputObjectSchema } from './ProductUpsertWithoutContentInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutContentInputObjectSchema as ProductUpdateToOneWithWhereWithoutContentInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutContentInput.schema';
import { ProductUpdateWithoutContentInputObjectSchema as ProductUpdateWithoutContentInputObjectSchema } from './ProductUpdateWithoutContentInput.schema';
import { ProductUncheckedUpdateWithoutContentInputObjectSchema as ProductUncheckedUpdateWithoutContentInputObjectSchema } from './ProductUncheckedUpdateWithoutContentInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutContentInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutContentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutContentInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutContentInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutContentInputObjectSchema), z.lazy(() => ProductUpdateWithoutContentInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutContentInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneRequiredWithoutContentNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutContentNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneRequiredWithoutContentNestedInput>;
export const ProductUpdateOneRequiredWithoutContentNestedInputObjectZodSchema = makeSchema();

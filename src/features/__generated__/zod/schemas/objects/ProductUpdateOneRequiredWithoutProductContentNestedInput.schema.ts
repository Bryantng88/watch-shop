import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutProductContentInputObjectSchema as ProductCreateWithoutProductContentInputObjectSchema } from './ProductCreateWithoutProductContentInput.schema';
import { ProductUncheckedCreateWithoutProductContentInputObjectSchema as ProductUncheckedCreateWithoutProductContentInputObjectSchema } from './ProductUncheckedCreateWithoutProductContentInput.schema';
import { ProductCreateOrConnectWithoutProductContentInputObjectSchema as ProductCreateOrConnectWithoutProductContentInputObjectSchema } from './ProductCreateOrConnectWithoutProductContentInput.schema';
import { ProductUpsertWithoutProductContentInputObjectSchema as ProductUpsertWithoutProductContentInputObjectSchema } from './ProductUpsertWithoutProductContentInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutProductContentInputObjectSchema as ProductUpdateToOneWithWhereWithoutProductContentInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutProductContentInput.schema';
import { ProductUpdateWithoutProductContentInputObjectSchema as ProductUpdateWithoutProductContentInputObjectSchema } from './ProductUpdateWithoutProductContentInput.schema';
import { ProductUncheckedUpdateWithoutProductContentInputObjectSchema as ProductUncheckedUpdateWithoutProductContentInputObjectSchema } from './ProductUncheckedUpdateWithoutProductContentInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutProductContentInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutProductContentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutProductContentInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutProductContentInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutProductContentInputObjectSchema), z.lazy(() => ProductUpdateWithoutProductContentInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutProductContentInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneRequiredWithoutProductContentNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutProductContentNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneRequiredWithoutProductContentNestedInput>;
export const ProductUpdateOneRequiredWithoutProductContentNestedInputObjectZodSchema = makeSchema();

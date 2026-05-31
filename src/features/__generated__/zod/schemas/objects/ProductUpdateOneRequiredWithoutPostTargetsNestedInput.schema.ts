import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutPostTargetsInputObjectSchema as ProductCreateWithoutPostTargetsInputObjectSchema } from './ProductCreateWithoutPostTargetsInput.schema';
import { ProductUncheckedCreateWithoutPostTargetsInputObjectSchema as ProductUncheckedCreateWithoutPostTargetsInputObjectSchema } from './ProductUncheckedCreateWithoutPostTargetsInput.schema';
import { ProductCreateOrConnectWithoutPostTargetsInputObjectSchema as ProductCreateOrConnectWithoutPostTargetsInputObjectSchema } from './ProductCreateOrConnectWithoutPostTargetsInput.schema';
import { ProductUpsertWithoutPostTargetsInputObjectSchema as ProductUpsertWithoutPostTargetsInputObjectSchema } from './ProductUpsertWithoutPostTargetsInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutPostTargetsInputObjectSchema as ProductUpdateToOneWithWhereWithoutPostTargetsInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutPostTargetsInput.schema';
import { ProductUpdateWithoutPostTargetsInputObjectSchema as ProductUpdateWithoutPostTargetsInputObjectSchema } from './ProductUpdateWithoutPostTargetsInput.schema';
import { ProductUncheckedUpdateWithoutPostTargetsInputObjectSchema as ProductUncheckedUpdateWithoutPostTargetsInputObjectSchema } from './ProductUncheckedUpdateWithoutPostTargetsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutPostTargetsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutPostTargetsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutPostTargetsInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutPostTargetsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutPostTargetsInputObjectSchema), z.lazy(() => ProductUpdateWithoutPostTargetsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutPostTargetsInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneRequiredWithoutPostTargetsNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutPostTargetsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneRequiredWithoutPostTargetsNestedInput>;
export const ProductUpdateOneRequiredWithoutPostTargetsNestedInputObjectZodSchema = makeSchema();

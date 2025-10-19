import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutVariantsInputObjectSchema as ProductCreateWithoutVariantsInputObjectSchema } from './ProductCreateWithoutVariantsInput.schema';
import { ProductUncheckedCreateWithoutVariantsInputObjectSchema as ProductUncheckedCreateWithoutVariantsInputObjectSchema } from './ProductUncheckedCreateWithoutVariantsInput.schema';
import { ProductCreateOrConnectWithoutVariantsInputObjectSchema as ProductCreateOrConnectWithoutVariantsInputObjectSchema } from './ProductCreateOrConnectWithoutVariantsInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutVariantsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutVariantsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutVariantsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutVariantsInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutVariantsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutVariantsInput>;
export const ProductCreateNestedOneWithoutVariantsInputObjectZodSchema = makeSchema();

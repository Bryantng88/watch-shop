import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutVariantsInputObjectSchema as ProductCreateWithoutVariantsInputObjectSchema } from './ProductCreateWithoutVariantsInput.schema';
import { ProductUncheckedCreateWithoutVariantsInputObjectSchema as ProductUncheckedCreateWithoutVariantsInputObjectSchema } from './ProductUncheckedCreateWithoutVariantsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutVariantsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutVariantsInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutVariantsInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutVariantsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutVariantsInput>;
export const ProductCreateOrConnectWithoutVariantsInputObjectZodSchema = makeSchema();

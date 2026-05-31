import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutPostTargetsInputObjectSchema as ProductCreateWithoutPostTargetsInputObjectSchema } from './ProductCreateWithoutPostTargetsInput.schema';
import { ProductUncheckedCreateWithoutPostTargetsInputObjectSchema as ProductUncheckedCreateWithoutPostTargetsInputObjectSchema } from './ProductUncheckedCreateWithoutPostTargetsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutPostTargetsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutPostTargetsInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutPostTargetsInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutPostTargetsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutPostTargetsInput>;
export const ProductCreateOrConnectWithoutPostTargetsInputObjectZodSchema = makeSchema();

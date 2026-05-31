import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutPostTargetsInputObjectSchema as ProductCreateWithoutPostTargetsInputObjectSchema } from './ProductCreateWithoutPostTargetsInput.schema';
import { ProductUncheckedCreateWithoutPostTargetsInputObjectSchema as ProductUncheckedCreateWithoutPostTargetsInputObjectSchema } from './ProductUncheckedCreateWithoutPostTargetsInput.schema';
import { ProductCreateOrConnectWithoutPostTargetsInputObjectSchema as ProductCreateOrConnectWithoutPostTargetsInputObjectSchema } from './ProductCreateOrConnectWithoutPostTargetsInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutPostTargetsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutPostTargetsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutPostTargetsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutPostTargetsInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutPostTargetsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutPostTargetsInput>;
export const ProductCreateNestedOneWithoutPostTargetsInputObjectZodSchema = makeSchema();

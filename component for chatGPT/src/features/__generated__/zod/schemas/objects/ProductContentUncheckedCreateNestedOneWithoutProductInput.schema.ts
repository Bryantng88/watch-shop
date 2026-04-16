import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductContentCreateWithoutProductInputObjectSchema as ProductContentCreateWithoutProductInputObjectSchema } from './ProductContentCreateWithoutProductInput.schema';
import { ProductContentUncheckedCreateWithoutProductInputObjectSchema as ProductContentUncheckedCreateWithoutProductInputObjectSchema } from './ProductContentUncheckedCreateWithoutProductInput.schema';
import { ProductContentCreateOrConnectWithoutProductInputObjectSchema as ProductContentCreateOrConnectWithoutProductInputObjectSchema } from './ProductContentCreateOrConnectWithoutProductInput.schema';
import { ProductContentWhereUniqueInputObjectSchema as ProductContentWhereUniqueInputObjectSchema } from './ProductContentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductContentCreateWithoutProductInputObjectSchema), z.lazy(() => ProductContentUncheckedCreateWithoutProductInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductContentCreateOrConnectWithoutProductInputObjectSchema).optional(),
  connect: z.lazy(() => ProductContentWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductContentUncheckedCreateNestedOneWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductContentUncheckedCreateNestedOneWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductContentUncheckedCreateNestedOneWithoutProductInput>;
export const ProductContentUncheckedCreateNestedOneWithoutProductInputObjectZodSchema = makeSchema();

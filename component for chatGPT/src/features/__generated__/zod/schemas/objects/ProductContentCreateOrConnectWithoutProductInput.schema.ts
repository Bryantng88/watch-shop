import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductContentWhereUniqueInputObjectSchema as ProductContentWhereUniqueInputObjectSchema } from './ProductContentWhereUniqueInput.schema';
import { ProductContentCreateWithoutProductInputObjectSchema as ProductContentCreateWithoutProductInputObjectSchema } from './ProductContentCreateWithoutProductInput.schema';
import { ProductContentUncheckedCreateWithoutProductInputObjectSchema as ProductContentUncheckedCreateWithoutProductInputObjectSchema } from './ProductContentUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductContentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductContentCreateWithoutProductInputObjectSchema), z.lazy(() => ProductContentUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const ProductContentCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductContentCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductContentCreateOrConnectWithoutProductInput>;
export const ProductContentCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();

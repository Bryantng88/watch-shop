import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductImageCreateWithoutProductInputObjectSchema as ProductImageCreateWithoutProductInputObjectSchema } from './ProductImageCreateWithoutProductInput.schema';
import { ProductImageUncheckedCreateWithoutProductInputObjectSchema as ProductImageUncheckedCreateWithoutProductInputObjectSchema } from './ProductImageUncheckedCreateWithoutProductInput.schema';
import { ProductImageCreateOrConnectWithoutProductInputObjectSchema as ProductImageCreateOrConnectWithoutProductInputObjectSchema } from './ProductImageCreateOrConnectWithoutProductInput.schema';
import { ProductImageCreateManyProductInputEnvelopeObjectSchema as ProductImageCreateManyProductInputEnvelopeObjectSchema } from './ProductImageCreateManyProductInputEnvelope.schema';
import { ProductImageWhereUniqueInputObjectSchema as ProductImageWhereUniqueInputObjectSchema } from './ProductImageWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductImageCreateWithoutProductInputObjectSchema), z.lazy(() => ProductImageCreateWithoutProductInputObjectSchema).array(), z.lazy(() => ProductImageUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => ProductImageUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductImageCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => ProductImageCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductImageCreateManyProductInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ProductImageWhereUniqueInputObjectSchema), z.lazy(() => ProductImageWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ProductImageUncheckedCreateNestedManyWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductImageUncheckedCreateNestedManyWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageUncheckedCreateNestedManyWithoutProductInput>;
export const ProductImageUncheckedCreateNestedManyWithoutProductInputObjectZodSchema = makeSchema();

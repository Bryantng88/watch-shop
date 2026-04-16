import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutBrandInputObjectSchema as ProductCreateWithoutBrandInputObjectSchema } from './ProductCreateWithoutBrandInput.schema';
import { ProductUncheckedCreateWithoutBrandInputObjectSchema as ProductUncheckedCreateWithoutBrandInputObjectSchema } from './ProductUncheckedCreateWithoutBrandInput.schema';
import { ProductCreateOrConnectWithoutBrandInputObjectSchema as ProductCreateOrConnectWithoutBrandInputObjectSchema } from './ProductCreateOrConnectWithoutBrandInput.schema';
import { ProductCreateManyBrandInputEnvelopeObjectSchema as ProductCreateManyBrandInputEnvelopeObjectSchema } from './ProductCreateManyBrandInputEnvelope.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutBrandInputObjectSchema), z.lazy(() => ProductCreateWithoutBrandInputObjectSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutBrandInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutBrandInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductCreateOrConnectWithoutBrandInputObjectSchema), z.lazy(() => ProductCreateOrConnectWithoutBrandInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductCreateManyBrandInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ProductUncheckedCreateNestedManyWithoutBrandInputObjectSchema: z.ZodType<Prisma.ProductUncheckedCreateNestedManyWithoutBrandInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUncheckedCreateNestedManyWithoutBrandInput>;
export const ProductUncheckedCreateNestedManyWithoutBrandInputObjectZodSchema = makeSchema();

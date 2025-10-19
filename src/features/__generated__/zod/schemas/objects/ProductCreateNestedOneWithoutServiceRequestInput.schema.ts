import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutServiceRequestInputObjectSchema as ProductCreateWithoutServiceRequestInputObjectSchema } from './ProductCreateWithoutServiceRequestInput.schema';
import { ProductUncheckedCreateWithoutServiceRequestInputObjectSchema as ProductUncheckedCreateWithoutServiceRequestInputObjectSchema } from './ProductUncheckedCreateWithoutServiceRequestInput.schema';
import { ProductCreateOrConnectWithoutServiceRequestInputObjectSchema as ProductCreateOrConnectWithoutServiceRequestInputObjectSchema } from './ProductCreateOrConnectWithoutServiceRequestInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutServiceRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutServiceRequestInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutServiceRequestInput>;
export const ProductCreateNestedOneWithoutServiceRequestInputObjectZodSchema = makeSchema();

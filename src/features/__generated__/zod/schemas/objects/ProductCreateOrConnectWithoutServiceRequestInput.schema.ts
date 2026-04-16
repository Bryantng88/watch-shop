import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutServiceRequestInputObjectSchema as ProductCreateWithoutServiceRequestInputObjectSchema } from './ProductCreateWithoutServiceRequestInput.schema';
import { ProductUncheckedCreateWithoutServiceRequestInputObjectSchema as ProductUncheckedCreateWithoutServiceRequestInputObjectSchema } from './ProductUncheckedCreateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutServiceRequestInput>;
export const ProductCreateOrConnectWithoutServiceRequestInputObjectZodSchema = makeSchema();

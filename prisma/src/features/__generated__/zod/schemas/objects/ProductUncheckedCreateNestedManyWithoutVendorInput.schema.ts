import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutVendorInputObjectSchema as ProductCreateWithoutVendorInputObjectSchema } from './ProductCreateWithoutVendorInput.schema';
import { ProductUncheckedCreateWithoutVendorInputObjectSchema as ProductUncheckedCreateWithoutVendorInputObjectSchema } from './ProductUncheckedCreateWithoutVendorInput.schema';
import { ProductCreateOrConnectWithoutVendorInputObjectSchema as ProductCreateOrConnectWithoutVendorInputObjectSchema } from './ProductCreateOrConnectWithoutVendorInput.schema';
import { ProductCreateManyVendorInputEnvelopeObjectSchema as ProductCreateManyVendorInputEnvelopeObjectSchema } from './ProductCreateManyVendorInputEnvelope.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutVendorInputObjectSchema), z.lazy(() => ProductCreateWithoutVendorInputObjectSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutVendorInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutVendorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductCreateOrConnectWithoutVendorInputObjectSchema), z.lazy(() => ProductCreateOrConnectWithoutVendorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductCreateManyVendorInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ProductUncheckedCreateNestedManyWithoutVendorInputObjectSchema: z.ZodType<Prisma.ProductUncheckedCreateNestedManyWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUncheckedCreateNestedManyWithoutVendorInput>;
export const ProductUncheckedCreateNestedManyWithoutVendorInputObjectZodSchema = makeSchema();

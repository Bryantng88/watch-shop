import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetCreateWithoutProductInputObjectSchema as ProductPostTargetCreateWithoutProductInputObjectSchema } from './ProductPostTargetCreateWithoutProductInput.schema';
import { ProductPostTargetUncheckedCreateWithoutProductInputObjectSchema as ProductPostTargetUncheckedCreateWithoutProductInputObjectSchema } from './ProductPostTargetUncheckedCreateWithoutProductInput.schema';
import { ProductPostTargetCreateOrConnectWithoutProductInputObjectSchema as ProductPostTargetCreateOrConnectWithoutProductInputObjectSchema } from './ProductPostTargetCreateOrConnectWithoutProductInput.schema';
import { ProductPostTargetCreateManyProductInputEnvelopeObjectSchema as ProductPostTargetCreateManyProductInputEnvelopeObjectSchema } from './ProductPostTargetCreateManyProductInputEnvelope.schema';
import { ProductPostTargetWhereUniqueInputObjectSchema as ProductPostTargetWhereUniqueInputObjectSchema } from './ProductPostTargetWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductPostTargetCreateWithoutProductInputObjectSchema), z.lazy(() => ProductPostTargetCreateWithoutProductInputObjectSchema).array(), z.lazy(() => ProductPostTargetUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => ProductPostTargetUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductPostTargetCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => ProductPostTargetCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductPostTargetCreateManyProductInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema), z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ProductPostTargetCreateNestedManyWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductPostTargetCreateNestedManyWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetCreateNestedManyWithoutProductInput>;
export const ProductPostTargetCreateNestedManyWithoutProductInputObjectZodSchema = makeSchema();

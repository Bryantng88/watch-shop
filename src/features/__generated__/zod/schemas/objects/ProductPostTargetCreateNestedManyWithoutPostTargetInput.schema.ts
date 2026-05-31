import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetCreateWithoutPostTargetInputObjectSchema as ProductPostTargetCreateWithoutPostTargetInputObjectSchema } from './ProductPostTargetCreateWithoutPostTargetInput.schema';
import { ProductPostTargetUncheckedCreateWithoutPostTargetInputObjectSchema as ProductPostTargetUncheckedCreateWithoutPostTargetInputObjectSchema } from './ProductPostTargetUncheckedCreateWithoutPostTargetInput.schema';
import { ProductPostTargetCreateOrConnectWithoutPostTargetInputObjectSchema as ProductPostTargetCreateOrConnectWithoutPostTargetInputObjectSchema } from './ProductPostTargetCreateOrConnectWithoutPostTargetInput.schema';
import { ProductPostTargetCreateManyPostTargetInputEnvelopeObjectSchema as ProductPostTargetCreateManyPostTargetInputEnvelopeObjectSchema } from './ProductPostTargetCreateManyPostTargetInputEnvelope.schema';
import { ProductPostTargetWhereUniqueInputObjectSchema as ProductPostTargetWhereUniqueInputObjectSchema } from './ProductPostTargetWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductPostTargetCreateWithoutPostTargetInputObjectSchema), z.lazy(() => ProductPostTargetCreateWithoutPostTargetInputObjectSchema).array(), z.lazy(() => ProductPostTargetUncheckedCreateWithoutPostTargetInputObjectSchema), z.lazy(() => ProductPostTargetUncheckedCreateWithoutPostTargetInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductPostTargetCreateOrConnectWithoutPostTargetInputObjectSchema), z.lazy(() => ProductPostTargetCreateOrConnectWithoutPostTargetInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductPostTargetCreateManyPostTargetInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema), z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ProductPostTargetCreateNestedManyWithoutPostTargetInputObjectSchema: z.ZodType<Prisma.ProductPostTargetCreateNestedManyWithoutPostTargetInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetCreateNestedManyWithoutPostTargetInput>;
export const ProductPostTargetCreateNestedManyWithoutPostTargetInputObjectZodSchema = makeSchema();

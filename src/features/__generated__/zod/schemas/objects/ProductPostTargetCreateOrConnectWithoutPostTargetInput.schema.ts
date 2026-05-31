import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetWhereUniqueInputObjectSchema as ProductPostTargetWhereUniqueInputObjectSchema } from './ProductPostTargetWhereUniqueInput.schema';
import { ProductPostTargetCreateWithoutPostTargetInputObjectSchema as ProductPostTargetCreateWithoutPostTargetInputObjectSchema } from './ProductPostTargetCreateWithoutPostTargetInput.schema';
import { ProductPostTargetUncheckedCreateWithoutPostTargetInputObjectSchema as ProductPostTargetUncheckedCreateWithoutPostTargetInputObjectSchema } from './ProductPostTargetUncheckedCreateWithoutPostTargetInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductPostTargetCreateWithoutPostTargetInputObjectSchema), z.lazy(() => ProductPostTargetUncheckedCreateWithoutPostTargetInputObjectSchema)])
}).strict();
export const ProductPostTargetCreateOrConnectWithoutPostTargetInputObjectSchema: z.ZodType<Prisma.ProductPostTargetCreateOrConnectWithoutPostTargetInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetCreateOrConnectWithoutPostTargetInput>;
export const ProductPostTargetCreateOrConnectWithoutPostTargetInputObjectZodSchema = makeSchema();

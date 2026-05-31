import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PostTargetCreateWithoutProductsInputObjectSchema as PostTargetCreateWithoutProductsInputObjectSchema } from './PostTargetCreateWithoutProductsInput.schema';
import { PostTargetUncheckedCreateWithoutProductsInputObjectSchema as PostTargetUncheckedCreateWithoutProductsInputObjectSchema } from './PostTargetUncheckedCreateWithoutProductsInput.schema';
import { PostTargetCreateOrConnectWithoutProductsInputObjectSchema as PostTargetCreateOrConnectWithoutProductsInputObjectSchema } from './PostTargetCreateOrConnectWithoutProductsInput.schema';
import { PostTargetWhereUniqueInputObjectSchema as PostTargetWhereUniqueInputObjectSchema } from './PostTargetWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PostTargetCreateWithoutProductsInputObjectSchema), z.lazy(() => PostTargetUncheckedCreateWithoutProductsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PostTargetCreateOrConnectWithoutProductsInputObjectSchema).optional(),
  connect: z.lazy(() => PostTargetWhereUniqueInputObjectSchema).optional()
}).strict();
export const PostTargetCreateNestedOneWithoutProductsInputObjectSchema: z.ZodType<Prisma.PostTargetCreateNestedOneWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.PostTargetCreateNestedOneWithoutProductsInput>;
export const PostTargetCreateNestedOneWithoutProductsInputObjectZodSchema = makeSchema();

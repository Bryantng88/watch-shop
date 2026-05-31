import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PostTargetWhereUniqueInputObjectSchema as PostTargetWhereUniqueInputObjectSchema } from './PostTargetWhereUniqueInput.schema';
import { PostTargetCreateWithoutProductsInputObjectSchema as PostTargetCreateWithoutProductsInputObjectSchema } from './PostTargetCreateWithoutProductsInput.schema';
import { PostTargetUncheckedCreateWithoutProductsInputObjectSchema as PostTargetUncheckedCreateWithoutProductsInputObjectSchema } from './PostTargetUncheckedCreateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PostTargetWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PostTargetCreateWithoutProductsInputObjectSchema), z.lazy(() => PostTargetUncheckedCreateWithoutProductsInputObjectSchema)])
}).strict();
export const PostTargetCreateOrConnectWithoutProductsInputObjectSchema: z.ZodType<Prisma.PostTargetCreateOrConnectWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.PostTargetCreateOrConnectWithoutProductsInput>;
export const PostTargetCreateOrConnectWithoutProductsInputObjectZodSchema = makeSchema();

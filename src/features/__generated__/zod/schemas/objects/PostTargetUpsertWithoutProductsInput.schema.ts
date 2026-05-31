import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PostTargetUpdateWithoutProductsInputObjectSchema as PostTargetUpdateWithoutProductsInputObjectSchema } from './PostTargetUpdateWithoutProductsInput.schema';
import { PostTargetUncheckedUpdateWithoutProductsInputObjectSchema as PostTargetUncheckedUpdateWithoutProductsInputObjectSchema } from './PostTargetUncheckedUpdateWithoutProductsInput.schema';
import { PostTargetCreateWithoutProductsInputObjectSchema as PostTargetCreateWithoutProductsInputObjectSchema } from './PostTargetCreateWithoutProductsInput.schema';
import { PostTargetUncheckedCreateWithoutProductsInputObjectSchema as PostTargetUncheckedCreateWithoutProductsInputObjectSchema } from './PostTargetUncheckedCreateWithoutProductsInput.schema';
import { PostTargetWhereInputObjectSchema as PostTargetWhereInputObjectSchema } from './PostTargetWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => PostTargetUpdateWithoutProductsInputObjectSchema), z.lazy(() => PostTargetUncheckedUpdateWithoutProductsInputObjectSchema)]),
  create: z.union([z.lazy(() => PostTargetCreateWithoutProductsInputObjectSchema), z.lazy(() => PostTargetUncheckedCreateWithoutProductsInputObjectSchema)]),
  where: z.lazy(() => PostTargetWhereInputObjectSchema).optional()
}).strict();
export const PostTargetUpsertWithoutProductsInputObjectSchema: z.ZodType<Prisma.PostTargetUpsertWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.PostTargetUpsertWithoutProductsInput>;
export const PostTargetUpsertWithoutProductsInputObjectZodSchema = makeSchema();

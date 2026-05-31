import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PostTargetWhereInputObjectSchema as PostTargetWhereInputObjectSchema } from './PostTargetWhereInput.schema';
import { PostTargetUpdateWithoutProductsInputObjectSchema as PostTargetUpdateWithoutProductsInputObjectSchema } from './PostTargetUpdateWithoutProductsInput.schema';
import { PostTargetUncheckedUpdateWithoutProductsInputObjectSchema as PostTargetUncheckedUpdateWithoutProductsInputObjectSchema } from './PostTargetUncheckedUpdateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PostTargetWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => PostTargetUpdateWithoutProductsInputObjectSchema), z.lazy(() => PostTargetUncheckedUpdateWithoutProductsInputObjectSchema)])
}).strict();
export const PostTargetUpdateToOneWithWhereWithoutProductsInputObjectSchema: z.ZodType<Prisma.PostTargetUpdateToOneWithWhereWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.PostTargetUpdateToOneWithWhereWithoutProductsInput>;
export const PostTargetUpdateToOneWithWhereWithoutProductsInputObjectZodSchema = makeSchema();

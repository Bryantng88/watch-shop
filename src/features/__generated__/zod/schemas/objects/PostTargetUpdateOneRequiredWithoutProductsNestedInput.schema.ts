import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PostTargetCreateWithoutProductsInputObjectSchema as PostTargetCreateWithoutProductsInputObjectSchema } from './PostTargetCreateWithoutProductsInput.schema';
import { PostTargetUncheckedCreateWithoutProductsInputObjectSchema as PostTargetUncheckedCreateWithoutProductsInputObjectSchema } from './PostTargetUncheckedCreateWithoutProductsInput.schema';
import { PostTargetCreateOrConnectWithoutProductsInputObjectSchema as PostTargetCreateOrConnectWithoutProductsInputObjectSchema } from './PostTargetCreateOrConnectWithoutProductsInput.schema';
import { PostTargetUpsertWithoutProductsInputObjectSchema as PostTargetUpsertWithoutProductsInputObjectSchema } from './PostTargetUpsertWithoutProductsInput.schema';
import { PostTargetWhereUniqueInputObjectSchema as PostTargetWhereUniqueInputObjectSchema } from './PostTargetWhereUniqueInput.schema';
import { PostTargetUpdateToOneWithWhereWithoutProductsInputObjectSchema as PostTargetUpdateToOneWithWhereWithoutProductsInputObjectSchema } from './PostTargetUpdateToOneWithWhereWithoutProductsInput.schema';
import { PostTargetUpdateWithoutProductsInputObjectSchema as PostTargetUpdateWithoutProductsInputObjectSchema } from './PostTargetUpdateWithoutProductsInput.schema';
import { PostTargetUncheckedUpdateWithoutProductsInputObjectSchema as PostTargetUncheckedUpdateWithoutProductsInputObjectSchema } from './PostTargetUncheckedUpdateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PostTargetCreateWithoutProductsInputObjectSchema), z.lazy(() => PostTargetUncheckedCreateWithoutProductsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PostTargetCreateOrConnectWithoutProductsInputObjectSchema).optional(),
  upsert: z.lazy(() => PostTargetUpsertWithoutProductsInputObjectSchema).optional(),
  connect: z.lazy(() => PostTargetWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => PostTargetUpdateToOneWithWhereWithoutProductsInputObjectSchema), z.lazy(() => PostTargetUpdateWithoutProductsInputObjectSchema), z.lazy(() => PostTargetUncheckedUpdateWithoutProductsInputObjectSchema)]).optional()
}).strict();
export const PostTargetUpdateOneRequiredWithoutProductsNestedInputObjectSchema: z.ZodType<Prisma.PostTargetUpdateOneRequiredWithoutProductsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PostTargetUpdateOneRequiredWithoutProductsNestedInput>;
export const PostTargetUpdateOneRequiredWithoutProductsNestedInputObjectZodSchema = makeSchema();

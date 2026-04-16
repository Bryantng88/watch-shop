import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapVariantSpecCreateWithoutProductVariantInputObjectSchema as StrapVariantSpecCreateWithoutProductVariantInputObjectSchema } from './StrapVariantSpecCreateWithoutProductVariantInput.schema';
import { StrapVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema as StrapVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema } from './StrapVariantSpecUncheckedCreateWithoutProductVariantInput.schema';
import { StrapVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema as StrapVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema } from './StrapVariantSpecCreateOrConnectWithoutProductVariantInput.schema';
import { StrapVariantSpecUpsertWithoutProductVariantInputObjectSchema as StrapVariantSpecUpsertWithoutProductVariantInputObjectSchema } from './StrapVariantSpecUpsertWithoutProductVariantInput.schema';
import { StrapVariantSpecWhereInputObjectSchema as StrapVariantSpecWhereInputObjectSchema } from './StrapVariantSpecWhereInput.schema';
import { StrapVariantSpecWhereUniqueInputObjectSchema as StrapVariantSpecWhereUniqueInputObjectSchema } from './StrapVariantSpecWhereUniqueInput.schema';
import { StrapVariantSpecUpdateToOneWithWhereWithoutProductVariantInputObjectSchema as StrapVariantSpecUpdateToOneWithWhereWithoutProductVariantInputObjectSchema } from './StrapVariantSpecUpdateToOneWithWhereWithoutProductVariantInput.schema';
import { StrapVariantSpecUpdateWithoutProductVariantInputObjectSchema as StrapVariantSpecUpdateWithoutProductVariantInputObjectSchema } from './StrapVariantSpecUpdateWithoutProductVariantInput.schema';
import { StrapVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema as StrapVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema } from './StrapVariantSpecUncheckedUpdateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => StrapVariantSpecCreateWithoutProductVariantInputObjectSchema), z.lazy(() => StrapVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StrapVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema).optional(),
  upsert: z.lazy(() => StrapVariantSpecUpsertWithoutProductVariantInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => StrapVariantSpecWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => StrapVariantSpecWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => StrapVariantSpecWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StrapVariantSpecUpdateToOneWithWhereWithoutProductVariantInputObjectSchema), z.lazy(() => StrapVariantSpecUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => StrapVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema)]).optional()
}).strict();
export const StrapVariantSpecUpdateOneWithoutProductVariantNestedInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecUpdateOneWithoutProductVariantNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecUpdateOneWithoutProductVariantNestedInput>;
export const StrapVariantSpecUpdateOneWithoutProductVariantNestedInputObjectZodSchema = makeSchema();

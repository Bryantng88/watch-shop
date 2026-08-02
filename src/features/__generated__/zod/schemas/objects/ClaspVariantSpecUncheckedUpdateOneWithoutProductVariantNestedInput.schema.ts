import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ClaspVariantSpecCreateWithoutProductVariantInputObjectSchema as ClaspVariantSpecCreateWithoutProductVariantInputObjectSchema } from './ClaspVariantSpecCreateWithoutProductVariantInput.schema';
import { ClaspVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema as ClaspVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema } from './ClaspVariantSpecUncheckedCreateWithoutProductVariantInput.schema';
import { ClaspVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema as ClaspVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema } from './ClaspVariantSpecCreateOrConnectWithoutProductVariantInput.schema';
import { ClaspVariantSpecUpsertWithoutProductVariantInputObjectSchema as ClaspVariantSpecUpsertWithoutProductVariantInputObjectSchema } from './ClaspVariantSpecUpsertWithoutProductVariantInput.schema';
import { ClaspVariantSpecWhereInputObjectSchema as ClaspVariantSpecWhereInputObjectSchema } from './ClaspVariantSpecWhereInput.schema';
import { ClaspVariantSpecWhereUniqueInputObjectSchema as ClaspVariantSpecWhereUniqueInputObjectSchema } from './ClaspVariantSpecWhereUniqueInput.schema';
import { ClaspVariantSpecUpdateToOneWithWhereWithoutProductVariantInputObjectSchema as ClaspVariantSpecUpdateToOneWithWhereWithoutProductVariantInputObjectSchema } from './ClaspVariantSpecUpdateToOneWithWhereWithoutProductVariantInput.schema';
import { ClaspVariantSpecUpdateWithoutProductVariantInputObjectSchema as ClaspVariantSpecUpdateWithoutProductVariantInputObjectSchema } from './ClaspVariantSpecUpdateWithoutProductVariantInput.schema';
import { ClaspVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema as ClaspVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema } from './ClaspVariantSpecUncheckedUpdateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ClaspVariantSpecCreateWithoutProductVariantInputObjectSchema), z.lazy(() => ClaspVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ClaspVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema).optional(),
  upsert: z.lazy(() => ClaspVariantSpecUpsertWithoutProductVariantInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ClaspVariantSpecWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ClaspVariantSpecWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ClaspVariantSpecWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ClaspVariantSpecUpdateToOneWithWhereWithoutProductVariantInputObjectSchema), z.lazy(() => ClaspVariantSpecUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => ClaspVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema)]).optional()
}).strict();
export const ClaspVariantSpecUncheckedUpdateOneWithoutProductVariantNestedInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecUncheckedUpdateOneWithoutProductVariantNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecUncheckedUpdateOneWithoutProductVariantNestedInput>;
export const ClaspVariantSpecUncheckedUpdateOneWithoutProductVariantNestedInputObjectZodSchema = makeSchema();

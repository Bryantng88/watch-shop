import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandCreateWithoutProductsInputObjectSchema as BrandCreateWithoutProductsInputObjectSchema } from './BrandCreateWithoutProductsInput.schema';
import { BrandUncheckedCreateWithoutProductsInputObjectSchema as BrandUncheckedCreateWithoutProductsInputObjectSchema } from './BrandUncheckedCreateWithoutProductsInput.schema';
import { BrandCreateOrConnectWithoutProductsInputObjectSchema as BrandCreateOrConnectWithoutProductsInputObjectSchema } from './BrandCreateOrConnectWithoutProductsInput.schema';
import { BrandUpsertWithoutProductsInputObjectSchema as BrandUpsertWithoutProductsInputObjectSchema } from './BrandUpsertWithoutProductsInput.schema';
import { BrandWhereInputObjectSchema as BrandWhereInputObjectSchema } from './BrandWhereInput.schema';
import { BrandWhereUniqueInputObjectSchema as BrandWhereUniqueInputObjectSchema } from './BrandWhereUniqueInput.schema';
import { BrandUpdateToOneWithWhereWithoutProductsInputObjectSchema as BrandUpdateToOneWithWhereWithoutProductsInputObjectSchema } from './BrandUpdateToOneWithWhereWithoutProductsInput.schema';
import { BrandUpdateWithoutProductsInputObjectSchema as BrandUpdateWithoutProductsInputObjectSchema } from './BrandUpdateWithoutProductsInput.schema';
import { BrandUncheckedUpdateWithoutProductsInputObjectSchema as BrandUncheckedUpdateWithoutProductsInputObjectSchema } from './BrandUncheckedUpdateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BrandCreateWithoutProductsInputObjectSchema), z.lazy(() => BrandUncheckedCreateWithoutProductsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BrandCreateOrConnectWithoutProductsInputObjectSchema).optional(),
  upsert: z.lazy(() => BrandUpsertWithoutProductsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => BrandWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => BrandWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => BrandWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => BrandUpdateToOneWithWhereWithoutProductsInputObjectSchema), z.lazy(() => BrandUpdateWithoutProductsInputObjectSchema), z.lazy(() => BrandUncheckedUpdateWithoutProductsInputObjectSchema)]).optional()
}).strict();
export const BrandUpdateOneWithoutProductsNestedInputObjectSchema: z.ZodType<Prisma.BrandUpdateOneWithoutProductsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandUpdateOneWithoutProductsNestedInput>;
export const BrandUpdateOneWithoutProductsNestedInputObjectZodSchema = makeSchema();

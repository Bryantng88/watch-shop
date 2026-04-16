import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandCreateWithoutProductInputObjectSchema as BrandCreateWithoutProductInputObjectSchema } from './BrandCreateWithoutProductInput.schema';
import { BrandUncheckedCreateWithoutProductInputObjectSchema as BrandUncheckedCreateWithoutProductInputObjectSchema } from './BrandUncheckedCreateWithoutProductInput.schema';
import { BrandCreateOrConnectWithoutProductInputObjectSchema as BrandCreateOrConnectWithoutProductInputObjectSchema } from './BrandCreateOrConnectWithoutProductInput.schema';
import { BrandUpsertWithoutProductInputObjectSchema as BrandUpsertWithoutProductInputObjectSchema } from './BrandUpsertWithoutProductInput.schema';
import { BrandWhereInputObjectSchema as BrandWhereInputObjectSchema } from './BrandWhereInput.schema';
import { BrandWhereUniqueInputObjectSchema as BrandWhereUniqueInputObjectSchema } from './BrandWhereUniqueInput.schema';
import { BrandUpdateToOneWithWhereWithoutProductInputObjectSchema as BrandUpdateToOneWithWhereWithoutProductInputObjectSchema } from './BrandUpdateToOneWithWhereWithoutProductInput.schema';
import { BrandUpdateWithoutProductInputObjectSchema as BrandUpdateWithoutProductInputObjectSchema } from './BrandUpdateWithoutProductInput.schema';
import { BrandUncheckedUpdateWithoutProductInputObjectSchema as BrandUncheckedUpdateWithoutProductInputObjectSchema } from './BrandUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BrandCreateWithoutProductInputObjectSchema), z.lazy(() => BrandUncheckedCreateWithoutProductInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BrandCreateOrConnectWithoutProductInputObjectSchema).optional(),
  upsert: z.lazy(() => BrandUpsertWithoutProductInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => BrandWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => BrandWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => BrandWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => BrandUpdateToOneWithWhereWithoutProductInputObjectSchema), z.lazy(() => BrandUpdateWithoutProductInputObjectSchema), z.lazy(() => BrandUncheckedUpdateWithoutProductInputObjectSchema)]).optional()
}).strict();
export const BrandUpdateOneWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.BrandUpdateOneWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandUpdateOneWithoutProductNestedInput>;
export const BrandUpdateOneWithoutProductNestedInputObjectZodSchema = makeSchema();

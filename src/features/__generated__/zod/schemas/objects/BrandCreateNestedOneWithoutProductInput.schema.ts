import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandCreateWithoutProductInputObjectSchema as BrandCreateWithoutProductInputObjectSchema } from './BrandCreateWithoutProductInput.schema';
import { BrandUncheckedCreateWithoutProductInputObjectSchema as BrandUncheckedCreateWithoutProductInputObjectSchema } from './BrandUncheckedCreateWithoutProductInput.schema';
import { BrandCreateOrConnectWithoutProductInputObjectSchema as BrandCreateOrConnectWithoutProductInputObjectSchema } from './BrandCreateOrConnectWithoutProductInput.schema';
import { BrandWhereUniqueInputObjectSchema as BrandWhereUniqueInputObjectSchema } from './BrandWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BrandCreateWithoutProductInputObjectSchema), z.lazy(() => BrandUncheckedCreateWithoutProductInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BrandCreateOrConnectWithoutProductInputObjectSchema).optional(),
  connect: z.lazy(() => BrandWhereUniqueInputObjectSchema).optional()
}).strict();
export const BrandCreateNestedOneWithoutProductInputObjectSchema: z.ZodType<Prisma.BrandCreateNestedOneWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandCreateNestedOneWithoutProductInput>;
export const BrandCreateNestedOneWithoutProductInputObjectZodSchema = makeSchema();

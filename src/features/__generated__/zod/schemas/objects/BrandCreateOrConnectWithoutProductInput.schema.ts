import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandWhereUniqueInputObjectSchema as BrandWhereUniqueInputObjectSchema } from './BrandWhereUniqueInput.schema';
import { BrandCreateWithoutProductInputObjectSchema as BrandCreateWithoutProductInputObjectSchema } from './BrandCreateWithoutProductInput.schema';
import { BrandUncheckedCreateWithoutProductInputObjectSchema as BrandUncheckedCreateWithoutProductInputObjectSchema } from './BrandUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BrandWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BrandCreateWithoutProductInputObjectSchema), z.lazy(() => BrandUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const BrandCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.BrandCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandCreateOrConnectWithoutProductInput>;
export const BrandCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartVariantSpecWhereUniqueInputObjectSchema as PartVariantSpecWhereUniqueInputObjectSchema } from './PartVariantSpecWhereUniqueInput.schema';
import { PartVariantSpecCreateWithoutProductVariantInputObjectSchema as PartVariantSpecCreateWithoutProductVariantInputObjectSchema } from './PartVariantSpecCreateWithoutProductVariantInput.schema';
import { PartVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema as PartVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema } from './PartVariantSpecUncheckedCreateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PartVariantSpecWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PartVariantSpecCreateWithoutProductVariantInputObjectSchema), z.lazy(() => PartVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema)])
}).strict();
export const PartVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.PartVariantSpecCreateOrConnectWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecCreateOrConnectWithoutProductVariantInput>;
export const PartVariantSpecCreateOrConnectWithoutProductVariantInputObjectZodSchema = makeSchema();

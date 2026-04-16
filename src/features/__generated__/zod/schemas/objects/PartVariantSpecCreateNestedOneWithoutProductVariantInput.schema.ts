import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartVariantSpecCreateWithoutProductVariantInputObjectSchema as PartVariantSpecCreateWithoutProductVariantInputObjectSchema } from './PartVariantSpecCreateWithoutProductVariantInput.schema';
import { PartVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema as PartVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema } from './PartVariantSpecUncheckedCreateWithoutProductVariantInput.schema';
import { PartVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema as PartVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema } from './PartVariantSpecCreateOrConnectWithoutProductVariantInput.schema';
import { PartVariantSpecWhereUniqueInputObjectSchema as PartVariantSpecWhereUniqueInputObjectSchema } from './PartVariantSpecWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PartVariantSpecCreateWithoutProductVariantInputObjectSchema), z.lazy(() => PartVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PartVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema).optional(),
  connect: z.lazy(() => PartVariantSpecWhereUniqueInputObjectSchema).optional()
}).strict();
export const PartVariantSpecCreateNestedOneWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.PartVariantSpecCreateNestedOneWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecCreateNestedOneWithoutProductVariantInput>;
export const PartVariantSpecCreateNestedOneWithoutProductVariantInputObjectZodSchema = makeSchema();

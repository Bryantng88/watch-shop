import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapVariantSpecCreateWithoutProductVariantInputObjectSchema as StrapVariantSpecCreateWithoutProductVariantInputObjectSchema } from './StrapVariantSpecCreateWithoutProductVariantInput.schema';
import { StrapVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema as StrapVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema } from './StrapVariantSpecUncheckedCreateWithoutProductVariantInput.schema';
import { StrapVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema as StrapVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema } from './StrapVariantSpecCreateOrConnectWithoutProductVariantInput.schema';
import { StrapVariantSpecWhereUniqueInputObjectSchema as StrapVariantSpecWhereUniqueInputObjectSchema } from './StrapVariantSpecWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => StrapVariantSpecCreateWithoutProductVariantInputObjectSchema), z.lazy(() => StrapVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StrapVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema).optional(),
  connect: z.lazy(() => StrapVariantSpecWhereUniqueInputObjectSchema).optional()
}).strict();
export const StrapVariantSpecCreateNestedOneWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecCreateNestedOneWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecCreateNestedOneWithoutProductVariantInput>;
export const StrapVariantSpecCreateNestedOneWithoutProductVariantInputObjectZodSchema = makeSchema();

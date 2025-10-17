import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapVariantSpecCreateWithoutVariantInputObjectSchema as StrapVariantSpecCreateWithoutVariantInputObjectSchema } from './StrapVariantSpecCreateWithoutVariantInput.schema';
import { StrapVariantSpecUncheckedCreateWithoutVariantInputObjectSchema as StrapVariantSpecUncheckedCreateWithoutVariantInputObjectSchema } from './StrapVariantSpecUncheckedCreateWithoutVariantInput.schema';
import { StrapVariantSpecCreateOrConnectWithoutVariantInputObjectSchema as StrapVariantSpecCreateOrConnectWithoutVariantInputObjectSchema } from './StrapVariantSpecCreateOrConnectWithoutVariantInput.schema';
import { StrapVariantSpecWhereUniqueInputObjectSchema as StrapVariantSpecWhereUniqueInputObjectSchema } from './StrapVariantSpecWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => StrapVariantSpecCreateWithoutVariantInputObjectSchema), z.lazy(() => StrapVariantSpecUncheckedCreateWithoutVariantInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StrapVariantSpecCreateOrConnectWithoutVariantInputObjectSchema).optional(),
  connect: z.lazy(() => StrapVariantSpecWhereUniqueInputObjectSchema).optional()
}).strict();
export const StrapVariantSpecUncheckedCreateNestedOneWithoutVariantInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecUncheckedCreateNestedOneWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecUncheckedCreateNestedOneWithoutVariantInput>;
export const StrapVariantSpecUncheckedCreateNestedOneWithoutVariantInputObjectZodSchema = makeSchema();

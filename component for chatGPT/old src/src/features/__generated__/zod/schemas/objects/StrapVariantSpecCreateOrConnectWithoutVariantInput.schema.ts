import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapVariantSpecWhereUniqueInputObjectSchema as StrapVariantSpecWhereUniqueInputObjectSchema } from './StrapVariantSpecWhereUniqueInput.schema';
import { StrapVariantSpecCreateWithoutVariantInputObjectSchema as StrapVariantSpecCreateWithoutVariantInputObjectSchema } from './StrapVariantSpecCreateWithoutVariantInput.schema';
import { StrapVariantSpecUncheckedCreateWithoutVariantInputObjectSchema as StrapVariantSpecUncheckedCreateWithoutVariantInputObjectSchema } from './StrapVariantSpecUncheckedCreateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => StrapVariantSpecWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StrapVariantSpecCreateWithoutVariantInputObjectSchema), z.lazy(() => StrapVariantSpecUncheckedCreateWithoutVariantInputObjectSchema)])
}).strict();
export const StrapVariantSpecCreateOrConnectWithoutVariantInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecCreateOrConnectWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecCreateOrConnectWithoutVariantInput>;
export const StrapVariantSpecCreateOrConnectWithoutVariantInputObjectZodSchema = makeSchema();

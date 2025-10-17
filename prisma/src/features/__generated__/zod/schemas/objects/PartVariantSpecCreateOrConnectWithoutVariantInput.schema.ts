import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartVariantSpecWhereUniqueInputObjectSchema as PartVariantSpecWhereUniqueInputObjectSchema } from './PartVariantSpecWhereUniqueInput.schema';
import { PartVariantSpecCreateWithoutVariantInputObjectSchema as PartVariantSpecCreateWithoutVariantInputObjectSchema } from './PartVariantSpecCreateWithoutVariantInput.schema';
import { PartVariantSpecUncheckedCreateWithoutVariantInputObjectSchema as PartVariantSpecUncheckedCreateWithoutVariantInputObjectSchema } from './PartVariantSpecUncheckedCreateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PartVariantSpecWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PartVariantSpecCreateWithoutVariantInputObjectSchema), z.lazy(() => PartVariantSpecUncheckedCreateWithoutVariantInputObjectSchema)])
}).strict();
export const PartVariantSpecCreateOrConnectWithoutVariantInputObjectSchema: z.ZodType<Prisma.PartVariantSpecCreateOrConnectWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecCreateOrConnectWithoutVariantInput>;
export const PartVariantSpecCreateOrConnectWithoutVariantInputObjectZodSchema = makeSchema();

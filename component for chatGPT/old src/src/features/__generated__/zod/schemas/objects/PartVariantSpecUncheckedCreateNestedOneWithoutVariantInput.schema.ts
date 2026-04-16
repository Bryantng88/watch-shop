import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartVariantSpecCreateWithoutVariantInputObjectSchema as PartVariantSpecCreateWithoutVariantInputObjectSchema } from './PartVariantSpecCreateWithoutVariantInput.schema';
import { PartVariantSpecUncheckedCreateWithoutVariantInputObjectSchema as PartVariantSpecUncheckedCreateWithoutVariantInputObjectSchema } from './PartVariantSpecUncheckedCreateWithoutVariantInput.schema';
import { PartVariantSpecCreateOrConnectWithoutVariantInputObjectSchema as PartVariantSpecCreateOrConnectWithoutVariantInputObjectSchema } from './PartVariantSpecCreateOrConnectWithoutVariantInput.schema';
import { PartVariantSpecWhereUniqueInputObjectSchema as PartVariantSpecWhereUniqueInputObjectSchema } from './PartVariantSpecWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PartVariantSpecCreateWithoutVariantInputObjectSchema), z.lazy(() => PartVariantSpecUncheckedCreateWithoutVariantInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PartVariantSpecCreateOrConnectWithoutVariantInputObjectSchema).optional(),
  connect: z.lazy(() => PartVariantSpecWhereUniqueInputObjectSchema).optional()
}).strict();
export const PartVariantSpecUncheckedCreateNestedOneWithoutVariantInputObjectSchema: z.ZodType<Prisma.PartVariantSpecUncheckedCreateNestedOneWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecUncheckedCreateNestedOneWithoutVariantInput>;
export const PartVariantSpecUncheckedCreateNestedOneWithoutVariantInputObjectZodSchema = makeSchema();

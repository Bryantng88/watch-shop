import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartVariantSpecCreateWithoutProductVariantInputObjectSchema as PartVariantSpecCreateWithoutProductVariantInputObjectSchema } from './PartVariantSpecCreateWithoutProductVariantInput.schema';
import { PartVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema as PartVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema } from './PartVariantSpecUncheckedCreateWithoutProductVariantInput.schema';
import { PartVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema as PartVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema } from './PartVariantSpecCreateOrConnectWithoutProductVariantInput.schema';
import { PartVariantSpecUpsertWithoutProductVariantInputObjectSchema as PartVariantSpecUpsertWithoutProductVariantInputObjectSchema } from './PartVariantSpecUpsertWithoutProductVariantInput.schema';
import { PartVariantSpecWhereInputObjectSchema as PartVariantSpecWhereInputObjectSchema } from './PartVariantSpecWhereInput.schema';
import { PartVariantSpecWhereUniqueInputObjectSchema as PartVariantSpecWhereUniqueInputObjectSchema } from './PartVariantSpecWhereUniqueInput.schema';
import { PartVariantSpecUpdateToOneWithWhereWithoutProductVariantInputObjectSchema as PartVariantSpecUpdateToOneWithWhereWithoutProductVariantInputObjectSchema } from './PartVariantSpecUpdateToOneWithWhereWithoutProductVariantInput.schema';
import { PartVariantSpecUpdateWithoutProductVariantInputObjectSchema as PartVariantSpecUpdateWithoutProductVariantInputObjectSchema } from './PartVariantSpecUpdateWithoutProductVariantInput.schema';
import { PartVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema as PartVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema } from './PartVariantSpecUncheckedUpdateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PartVariantSpecCreateWithoutProductVariantInputObjectSchema), z.lazy(() => PartVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PartVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema).optional(),
  upsert: z.lazy(() => PartVariantSpecUpsertWithoutProductVariantInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => PartVariantSpecWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => PartVariantSpecWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => PartVariantSpecWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => PartVariantSpecUpdateToOneWithWhereWithoutProductVariantInputObjectSchema), z.lazy(() => PartVariantSpecUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => PartVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema)]).optional()
}).strict();
export const PartVariantSpecUpdateOneWithoutProductVariantNestedInputObjectSchema: z.ZodType<Prisma.PartVariantSpecUpdateOneWithoutProductVariantNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecUpdateOneWithoutProductVariantNestedInput>;
export const PartVariantSpecUpdateOneWithoutProductVariantNestedInputObjectZodSchema = makeSchema();

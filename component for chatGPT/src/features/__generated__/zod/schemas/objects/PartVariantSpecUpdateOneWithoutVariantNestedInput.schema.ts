import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartVariantSpecCreateWithoutVariantInputObjectSchema as PartVariantSpecCreateWithoutVariantInputObjectSchema } from './PartVariantSpecCreateWithoutVariantInput.schema';
import { PartVariantSpecUncheckedCreateWithoutVariantInputObjectSchema as PartVariantSpecUncheckedCreateWithoutVariantInputObjectSchema } from './PartVariantSpecUncheckedCreateWithoutVariantInput.schema';
import { PartVariantSpecCreateOrConnectWithoutVariantInputObjectSchema as PartVariantSpecCreateOrConnectWithoutVariantInputObjectSchema } from './PartVariantSpecCreateOrConnectWithoutVariantInput.schema';
import { PartVariantSpecUpsertWithoutVariantInputObjectSchema as PartVariantSpecUpsertWithoutVariantInputObjectSchema } from './PartVariantSpecUpsertWithoutVariantInput.schema';
import { PartVariantSpecWhereInputObjectSchema as PartVariantSpecWhereInputObjectSchema } from './PartVariantSpecWhereInput.schema';
import { PartVariantSpecWhereUniqueInputObjectSchema as PartVariantSpecWhereUniqueInputObjectSchema } from './PartVariantSpecWhereUniqueInput.schema';
import { PartVariantSpecUpdateToOneWithWhereWithoutVariantInputObjectSchema as PartVariantSpecUpdateToOneWithWhereWithoutVariantInputObjectSchema } from './PartVariantSpecUpdateToOneWithWhereWithoutVariantInput.schema';
import { PartVariantSpecUpdateWithoutVariantInputObjectSchema as PartVariantSpecUpdateWithoutVariantInputObjectSchema } from './PartVariantSpecUpdateWithoutVariantInput.schema';
import { PartVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema as PartVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema } from './PartVariantSpecUncheckedUpdateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PartVariantSpecCreateWithoutVariantInputObjectSchema), z.lazy(() => PartVariantSpecUncheckedCreateWithoutVariantInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PartVariantSpecCreateOrConnectWithoutVariantInputObjectSchema).optional(),
  upsert: z.lazy(() => PartVariantSpecUpsertWithoutVariantInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => PartVariantSpecWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => PartVariantSpecWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => PartVariantSpecWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => PartVariantSpecUpdateToOneWithWhereWithoutVariantInputObjectSchema), z.lazy(() => PartVariantSpecUpdateWithoutVariantInputObjectSchema), z.lazy(() => PartVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema)]).optional()
}).strict();
export const PartVariantSpecUpdateOneWithoutVariantNestedInputObjectSchema: z.ZodType<Prisma.PartVariantSpecUpdateOneWithoutVariantNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecUpdateOneWithoutVariantNestedInput>;
export const PartVariantSpecUpdateOneWithoutVariantNestedInputObjectZodSchema = makeSchema();

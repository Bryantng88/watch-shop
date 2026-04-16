import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapVariantSpecCreateWithoutVariantInputObjectSchema as StrapVariantSpecCreateWithoutVariantInputObjectSchema } from './StrapVariantSpecCreateWithoutVariantInput.schema';
import { StrapVariantSpecUncheckedCreateWithoutVariantInputObjectSchema as StrapVariantSpecUncheckedCreateWithoutVariantInputObjectSchema } from './StrapVariantSpecUncheckedCreateWithoutVariantInput.schema';
import { StrapVariantSpecCreateOrConnectWithoutVariantInputObjectSchema as StrapVariantSpecCreateOrConnectWithoutVariantInputObjectSchema } from './StrapVariantSpecCreateOrConnectWithoutVariantInput.schema';
import { StrapVariantSpecUpsertWithoutVariantInputObjectSchema as StrapVariantSpecUpsertWithoutVariantInputObjectSchema } from './StrapVariantSpecUpsertWithoutVariantInput.schema';
import { StrapVariantSpecWhereInputObjectSchema as StrapVariantSpecWhereInputObjectSchema } from './StrapVariantSpecWhereInput.schema';
import { StrapVariantSpecWhereUniqueInputObjectSchema as StrapVariantSpecWhereUniqueInputObjectSchema } from './StrapVariantSpecWhereUniqueInput.schema';
import { StrapVariantSpecUpdateToOneWithWhereWithoutVariantInputObjectSchema as StrapVariantSpecUpdateToOneWithWhereWithoutVariantInputObjectSchema } from './StrapVariantSpecUpdateToOneWithWhereWithoutVariantInput.schema';
import { StrapVariantSpecUpdateWithoutVariantInputObjectSchema as StrapVariantSpecUpdateWithoutVariantInputObjectSchema } from './StrapVariantSpecUpdateWithoutVariantInput.schema';
import { StrapVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema as StrapVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema } from './StrapVariantSpecUncheckedUpdateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => StrapVariantSpecCreateWithoutVariantInputObjectSchema), z.lazy(() => StrapVariantSpecUncheckedCreateWithoutVariantInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StrapVariantSpecCreateOrConnectWithoutVariantInputObjectSchema).optional(),
  upsert: z.lazy(() => StrapVariantSpecUpsertWithoutVariantInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => StrapVariantSpecWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => StrapVariantSpecWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => StrapVariantSpecWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StrapVariantSpecUpdateToOneWithWhereWithoutVariantInputObjectSchema), z.lazy(() => StrapVariantSpecUpdateWithoutVariantInputObjectSchema), z.lazy(() => StrapVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema)]).optional()
}).strict();
export const StrapVariantSpecUncheckedUpdateOneWithoutVariantNestedInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecUncheckedUpdateOneWithoutVariantNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecUncheckedUpdateOneWithoutVariantNestedInput>;
export const StrapVariantSpecUncheckedUpdateOneWithoutVariantNestedInputObjectZodSchema = makeSchema();

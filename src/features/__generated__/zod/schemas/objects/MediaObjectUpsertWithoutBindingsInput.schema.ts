import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectUpdateWithoutBindingsInputObjectSchema as MediaObjectUpdateWithoutBindingsInputObjectSchema } from './MediaObjectUpdateWithoutBindingsInput.schema';
import { MediaObjectUncheckedUpdateWithoutBindingsInputObjectSchema as MediaObjectUncheckedUpdateWithoutBindingsInputObjectSchema } from './MediaObjectUncheckedUpdateWithoutBindingsInput.schema';
import { MediaObjectCreateWithoutBindingsInputObjectSchema as MediaObjectCreateWithoutBindingsInputObjectSchema } from './MediaObjectCreateWithoutBindingsInput.schema';
import { MediaObjectUncheckedCreateWithoutBindingsInputObjectSchema as MediaObjectUncheckedCreateWithoutBindingsInputObjectSchema } from './MediaObjectUncheckedCreateWithoutBindingsInput.schema';
import { MediaObjectWhereInputObjectSchema as MediaObjectWhereInputObjectSchema } from './MediaObjectWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => MediaObjectUpdateWithoutBindingsInputObjectSchema), z.lazy(() => MediaObjectUncheckedUpdateWithoutBindingsInputObjectSchema)]),
  create: z.union([z.lazy(() => MediaObjectCreateWithoutBindingsInputObjectSchema), z.lazy(() => MediaObjectUncheckedCreateWithoutBindingsInputObjectSchema)]),
  where: z.lazy(() => MediaObjectWhereInputObjectSchema).optional()
}).strict();
export const MediaObjectUpsertWithoutBindingsInputObjectSchema: z.ZodType<Prisma.MediaObjectUpsertWithoutBindingsInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectUpsertWithoutBindingsInput>;
export const MediaObjectUpsertWithoutBindingsInputObjectZodSchema = makeSchema();

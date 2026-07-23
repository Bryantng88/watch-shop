import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectWhereInputObjectSchema as MediaObjectWhereInputObjectSchema } from './MediaObjectWhereInput.schema';
import { MediaObjectUpdateWithoutBindingsInputObjectSchema as MediaObjectUpdateWithoutBindingsInputObjectSchema } from './MediaObjectUpdateWithoutBindingsInput.schema';
import { MediaObjectUncheckedUpdateWithoutBindingsInputObjectSchema as MediaObjectUncheckedUpdateWithoutBindingsInputObjectSchema } from './MediaObjectUncheckedUpdateWithoutBindingsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MediaObjectWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => MediaObjectUpdateWithoutBindingsInputObjectSchema), z.lazy(() => MediaObjectUncheckedUpdateWithoutBindingsInputObjectSchema)])
}).strict();
export const MediaObjectUpdateToOneWithWhereWithoutBindingsInputObjectSchema: z.ZodType<Prisma.MediaObjectUpdateToOneWithWhereWithoutBindingsInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectUpdateToOneWithWhereWithoutBindingsInput>;
export const MediaObjectUpdateToOneWithWhereWithoutBindingsInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaBindingWhereUniqueInputObjectSchema as MediaBindingWhereUniqueInputObjectSchema } from './MediaBindingWhereUniqueInput.schema';
import { MediaBindingUpdateWithoutMediaObjectInputObjectSchema as MediaBindingUpdateWithoutMediaObjectInputObjectSchema } from './MediaBindingUpdateWithoutMediaObjectInput.schema';
import { MediaBindingUncheckedUpdateWithoutMediaObjectInputObjectSchema as MediaBindingUncheckedUpdateWithoutMediaObjectInputObjectSchema } from './MediaBindingUncheckedUpdateWithoutMediaObjectInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MediaBindingWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MediaBindingUpdateWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaBindingUncheckedUpdateWithoutMediaObjectInputObjectSchema)])
}).strict();
export const MediaBindingUpdateWithWhereUniqueWithoutMediaObjectInputObjectSchema: z.ZodType<Prisma.MediaBindingUpdateWithWhereUniqueWithoutMediaObjectInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingUpdateWithWhereUniqueWithoutMediaObjectInput>;
export const MediaBindingUpdateWithWhereUniqueWithoutMediaObjectInputObjectZodSchema = makeSchema();

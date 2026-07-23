import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaBindingWhereUniqueInputObjectSchema as MediaBindingWhereUniqueInputObjectSchema } from './MediaBindingWhereUniqueInput.schema';
import { MediaBindingUpdateWithoutMediaObjectInputObjectSchema as MediaBindingUpdateWithoutMediaObjectInputObjectSchema } from './MediaBindingUpdateWithoutMediaObjectInput.schema';
import { MediaBindingUncheckedUpdateWithoutMediaObjectInputObjectSchema as MediaBindingUncheckedUpdateWithoutMediaObjectInputObjectSchema } from './MediaBindingUncheckedUpdateWithoutMediaObjectInput.schema';
import { MediaBindingCreateWithoutMediaObjectInputObjectSchema as MediaBindingCreateWithoutMediaObjectInputObjectSchema } from './MediaBindingCreateWithoutMediaObjectInput.schema';
import { MediaBindingUncheckedCreateWithoutMediaObjectInputObjectSchema as MediaBindingUncheckedCreateWithoutMediaObjectInputObjectSchema } from './MediaBindingUncheckedCreateWithoutMediaObjectInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MediaBindingWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MediaBindingUpdateWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaBindingUncheckedUpdateWithoutMediaObjectInputObjectSchema)]),
  create: z.union([z.lazy(() => MediaBindingCreateWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaBindingUncheckedCreateWithoutMediaObjectInputObjectSchema)])
}).strict();
export const MediaBindingUpsertWithWhereUniqueWithoutMediaObjectInputObjectSchema: z.ZodType<Prisma.MediaBindingUpsertWithWhereUniqueWithoutMediaObjectInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingUpsertWithWhereUniqueWithoutMediaObjectInput>;
export const MediaBindingUpsertWithWhereUniqueWithoutMediaObjectInputObjectZodSchema = makeSchema();

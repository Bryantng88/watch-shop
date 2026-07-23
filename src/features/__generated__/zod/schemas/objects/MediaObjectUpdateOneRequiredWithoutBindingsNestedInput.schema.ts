import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectCreateWithoutBindingsInputObjectSchema as MediaObjectCreateWithoutBindingsInputObjectSchema } from './MediaObjectCreateWithoutBindingsInput.schema';
import { MediaObjectUncheckedCreateWithoutBindingsInputObjectSchema as MediaObjectUncheckedCreateWithoutBindingsInputObjectSchema } from './MediaObjectUncheckedCreateWithoutBindingsInput.schema';
import { MediaObjectCreateOrConnectWithoutBindingsInputObjectSchema as MediaObjectCreateOrConnectWithoutBindingsInputObjectSchema } from './MediaObjectCreateOrConnectWithoutBindingsInput.schema';
import { MediaObjectUpsertWithoutBindingsInputObjectSchema as MediaObjectUpsertWithoutBindingsInputObjectSchema } from './MediaObjectUpsertWithoutBindingsInput.schema';
import { MediaObjectWhereUniqueInputObjectSchema as MediaObjectWhereUniqueInputObjectSchema } from './MediaObjectWhereUniqueInput.schema';
import { MediaObjectUpdateToOneWithWhereWithoutBindingsInputObjectSchema as MediaObjectUpdateToOneWithWhereWithoutBindingsInputObjectSchema } from './MediaObjectUpdateToOneWithWhereWithoutBindingsInput.schema';
import { MediaObjectUpdateWithoutBindingsInputObjectSchema as MediaObjectUpdateWithoutBindingsInputObjectSchema } from './MediaObjectUpdateWithoutBindingsInput.schema';
import { MediaObjectUncheckedUpdateWithoutBindingsInputObjectSchema as MediaObjectUncheckedUpdateWithoutBindingsInputObjectSchema } from './MediaObjectUncheckedUpdateWithoutBindingsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MediaObjectCreateWithoutBindingsInputObjectSchema), z.lazy(() => MediaObjectUncheckedCreateWithoutBindingsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => MediaObjectCreateOrConnectWithoutBindingsInputObjectSchema).optional(),
  upsert: z.lazy(() => MediaObjectUpsertWithoutBindingsInputObjectSchema).optional(),
  connect: z.lazy(() => MediaObjectWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => MediaObjectUpdateToOneWithWhereWithoutBindingsInputObjectSchema), z.lazy(() => MediaObjectUpdateWithoutBindingsInputObjectSchema), z.lazy(() => MediaObjectUncheckedUpdateWithoutBindingsInputObjectSchema)]).optional()
}).strict();
export const MediaObjectUpdateOneRequiredWithoutBindingsNestedInputObjectSchema: z.ZodType<Prisma.MediaObjectUpdateOneRequiredWithoutBindingsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectUpdateOneRequiredWithoutBindingsNestedInput>;
export const MediaObjectUpdateOneRequiredWithoutBindingsNestedInputObjectZodSchema = makeSchema();

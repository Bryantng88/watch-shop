import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectCreateWithoutBindingsInputObjectSchema as MediaObjectCreateWithoutBindingsInputObjectSchema } from './MediaObjectCreateWithoutBindingsInput.schema';
import { MediaObjectUncheckedCreateWithoutBindingsInputObjectSchema as MediaObjectUncheckedCreateWithoutBindingsInputObjectSchema } from './MediaObjectUncheckedCreateWithoutBindingsInput.schema';
import { MediaObjectCreateOrConnectWithoutBindingsInputObjectSchema as MediaObjectCreateOrConnectWithoutBindingsInputObjectSchema } from './MediaObjectCreateOrConnectWithoutBindingsInput.schema';
import { MediaObjectWhereUniqueInputObjectSchema as MediaObjectWhereUniqueInputObjectSchema } from './MediaObjectWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MediaObjectCreateWithoutBindingsInputObjectSchema), z.lazy(() => MediaObjectUncheckedCreateWithoutBindingsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => MediaObjectCreateOrConnectWithoutBindingsInputObjectSchema).optional(),
  connect: z.lazy(() => MediaObjectWhereUniqueInputObjectSchema).optional()
}).strict();
export const MediaObjectCreateNestedOneWithoutBindingsInputObjectSchema: z.ZodType<Prisma.MediaObjectCreateNestedOneWithoutBindingsInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectCreateNestedOneWithoutBindingsInput>;
export const MediaObjectCreateNestedOneWithoutBindingsInputObjectZodSchema = makeSchema();

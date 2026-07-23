import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectWhereUniqueInputObjectSchema as MediaObjectWhereUniqueInputObjectSchema } from './MediaObjectWhereUniqueInput.schema';
import { MediaObjectCreateWithoutBindingsInputObjectSchema as MediaObjectCreateWithoutBindingsInputObjectSchema } from './MediaObjectCreateWithoutBindingsInput.schema';
import { MediaObjectUncheckedCreateWithoutBindingsInputObjectSchema as MediaObjectUncheckedCreateWithoutBindingsInputObjectSchema } from './MediaObjectUncheckedCreateWithoutBindingsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MediaObjectWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MediaObjectCreateWithoutBindingsInputObjectSchema), z.lazy(() => MediaObjectUncheckedCreateWithoutBindingsInputObjectSchema)])
}).strict();
export const MediaObjectCreateOrConnectWithoutBindingsInputObjectSchema: z.ZodType<Prisma.MediaObjectCreateOrConnectWithoutBindingsInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectCreateOrConnectWithoutBindingsInput>;
export const MediaObjectCreateOrConnectWithoutBindingsInputObjectZodSchema = makeSchema();

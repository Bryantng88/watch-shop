import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagLinkWhereUniqueInputObjectSchema as AppTagLinkWhereUniqueInputObjectSchema } from './AppTagLinkWhereUniqueInput.schema';
import { AppTagLinkUpdateWithoutTagInputObjectSchema as AppTagLinkUpdateWithoutTagInputObjectSchema } from './AppTagLinkUpdateWithoutTagInput.schema';
import { AppTagLinkUncheckedUpdateWithoutTagInputObjectSchema as AppTagLinkUncheckedUpdateWithoutTagInputObjectSchema } from './AppTagLinkUncheckedUpdateWithoutTagInput.schema';
import { AppTagLinkCreateWithoutTagInputObjectSchema as AppTagLinkCreateWithoutTagInputObjectSchema } from './AppTagLinkCreateWithoutTagInput.schema';
import { AppTagLinkUncheckedCreateWithoutTagInputObjectSchema as AppTagLinkUncheckedCreateWithoutTagInputObjectSchema } from './AppTagLinkUncheckedCreateWithoutTagInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AppTagLinkWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AppTagLinkUpdateWithoutTagInputObjectSchema), z.lazy(() => AppTagLinkUncheckedUpdateWithoutTagInputObjectSchema)]),
  create: z.union([z.lazy(() => AppTagLinkCreateWithoutTagInputObjectSchema), z.lazy(() => AppTagLinkUncheckedCreateWithoutTagInputObjectSchema)])
}).strict();
export const AppTagLinkUpsertWithWhereUniqueWithoutTagInputObjectSchema: z.ZodType<Prisma.AppTagLinkUpsertWithWhereUniqueWithoutTagInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkUpsertWithWhereUniqueWithoutTagInput>;
export const AppTagLinkUpsertWithWhereUniqueWithoutTagInputObjectZodSchema = makeSchema();

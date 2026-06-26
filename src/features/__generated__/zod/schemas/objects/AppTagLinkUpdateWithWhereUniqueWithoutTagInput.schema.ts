import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagLinkWhereUniqueInputObjectSchema as AppTagLinkWhereUniqueInputObjectSchema } from './AppTagLinkWhereUniqueInput.schema';
import { AppTagLinkUpdateWithoutTagInputObjectSchema as AppTagLinkUpdateWithoutTagInputObjectSchema } from './AppTagLinkUpdateWithoutTagInput.schema';
import { AppTagLinkUncheckedUpdateWithoutTagInputObjectSchema as AppTagLinkUncheckedUpdateWithoutTagInputObjectSchema } from './AppTagLinkUncheckedUpdateWithoutTagInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AppTagLinkWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AppTagLinkUpdateWithoutTagInputObjectSchema), z.lazy(() => AppTagLinkUncheckedUpdateWithoutTagInputObjectSchema)])
}).strict();
export const AppTagLinkUpdateWithWhereUniqueWithoutTagInputObjectSchema: z.ZodType<Prisma.AppTagLinkUpdateWithWhereUniqueWithoutTagInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkUpdateWithWhereUniqueWithoutTagInput>;
export const AppTagLinkUpdateWithWhereUniqueWithoutTagInputObjectZodSchema = makeSchema();

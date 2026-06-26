import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagWhereInputObjectSchema as AppTagWhereInputObjectSchema } from './AppTagWhereInput.schema';
import { AppTagUpdateWithoutLinksInputObjectSchema as AppTagUpdateWithoutLinksInputObjectSchema } from './AppTagUpdateWithoutLinksInput.schema';
import { AppTagUncheckedUpdateWithoutLinksInputObjectSchema as AppTagUncheckedUpdateWithoutLinksInputObjectSchema } from './AppTagUncheckedUpdateWithoutLinksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AppTagWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AppTagUpdateWithoutLinksInputObjectSchema), z.lazy(() => AppTagUncheckedUpdateWithoutLinksInputObjectSchema)])
}).strict();
export const AppTagUpdateToOneWithWhereWithoutLinksInputObjectSchema: z.ZodType<Prisma.AppTagUpdateToOneWithWhereWithoutLinksInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagUpdateToOneWithWhereWithoutLinksInput>;
export const AppTagUpdateToOneWithWhereWithoutLinksInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagUpdateWithoutLinksInputObjectSchema as AppTagUpdateWithoutLinksInputObjectSchema } from './AppTagUpdateWithoutLinksInput.schema';
import { AppTagUncheckedUpdateWithoutLinksInputObjectSchema as AppTagUncheckedUpdateWithoutLinksInputObjectSchema } from './AppTagUncheckedUpdateWithoutLinksInput.schema';
import { AppTagCreateWithoutLinksInputObjectSchema as AppTagCreateWithoutLinksInputObjectSchema } from './AppTagCreateWithoutLinksInput.schema';
import { AppTagUncheckedCreateWithoutLinksInputObjectSchema as AppTagUncheckedCreateWithoutLinksInputObjectSchema } from './AppTagUncheckedCreateWithoutLinksInput.schema';
import { AppTagWhereInputObjectSchema as AppTagWhereInputObjectSchema } from './AppTagWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => AppTagUpdateWithoutLinksInputObjectSchema), z.lazy(() => AppTagUncheckedUpdateWithoutLinksInputObjectSchema)]),
  create: z.union([z.lazy(() => AppTagCreateWithoutLinksInputObjectSchema), z.lazy(() => AppTagUncheckedCreateWithoutLinksInputObjectSchema)]),
  where: z.lazy(() => AppTagWhereInputObjectSchema).optional()
}).strict();
export const AppTagUpsertWithoutLinksInputObjectSchema: z.ZodType<Prisma.AppTagUpsertWithoutLinksInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagUpsertWithoutLinksInput>;
export const AppTagUpsertWithoutLinksInputObjectZodSchema = makeSchema();

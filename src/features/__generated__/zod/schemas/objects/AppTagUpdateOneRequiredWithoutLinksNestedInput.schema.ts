import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagCreateWithoutLinksInputObjectSchema as AppTagCreateWithoutLinksInputObjectSchema } from './AppTagCreateWithoutLinksInput.schema';
import { AppTagUncheckedCreateWithoutLinksInputObjectSchema as AppTagUncheckedCreateWithoutLinksInputObjectSchema } from './AppTagUncheckedCreateWithoutLinksInput.schema';
import { AppTagCreateOrConnectWithoutLinksInputObjectSchema as AppTagCreateOrConnectWithoutLinksInputObjectSchema } from './AppTagCreateOrConnectWithoutLinksInput.schema';
import { AppTagUpsertWithoutLinksInputObjectSchema as AppTagUpsertWithoutLinksInputObjectSchema } from './AppTagUpsertWithoutLinksInput.schema';
import { AppTagWhereUniqueInputObjectSchema as AppTagWhereUniqueInputObjectSchema } from './AppTagWhereUniqueInput.schema';
import { AppTagUpdateToOneWithWhereWithoutLinksInputObjectSchema as AppTagUpdateToOneWithWhereWithoutLinksInputObjectSchema } from './AppTagUpdateToOneWithWhereWithoutLinksInput.schema';
import { AppTagUpdateWithoutLinksInputObjectSchema as AppTagUpdateWithoutLinksInputObjectSchema } from './AppTagUpdateWithoutLinksInput.schema';
import { AppTagUncheckedUpdateWithoutLinksInputObjectSchema as AppTagUncheckedUpdateWithoutLinksInputObjectSchema } from './AppTagUncheckedUpdateWithoutLinksInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AppTagCreateWithoutLinksInputObjectSchema), z.lazy(() => AppTagUncheckedCreateWithoutLinksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AppTagCreateOrConnectWithoutLinksInputObjectSchema).optional(),
  upsert: z.lazy(() => AppTagUpsertWithoutLinksInputObjectSchema).optional(),
  connect: z.lazy(() => AppTagWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AppTagUpdateToOneWithWhereWithoutLinksInputObjectSchema), z.lazy(() => AppTagUpdateWithoutLinksInputObjectSchema), z.lazy(() => AppTagUncheckedUpdateWithoutLinksInputObjectSchema)]).optional()
}).strict();
export const AppTagUpdateOneRequiredWithoutLinksNestedInputObjectSchema: z.ZodType<Prisma.AppTagUpdateOneRequiredWithoutLinksNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagUpdateOneRequiredWithoutLinksNestedInput>;
export const AppTagUpdateOneRequiredWithoutLinksNestedInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagWhereUniqueInputObjectSchema as AppTagWhereUniqueInputObjectSchema } from './AppTagWhereUniqueInput.schema';
import { AppTagCreateWithoutLinksInputObjectSchema as AppTagCreateWithoutLinksInputObjectSchema } from './AppTagCreateWithoutLinksInput.schema';
import { AppTagUncheckedCreateWithoutLinksInputObjectSchema as AppTagUncheckedCreateWithoutLinksInputObjectSchema } from './AppTagUncheckedCreateWithoutLinksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AppTagWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AppTagCreateWithoutLinksInputObjectSchema), z.lazy(() => AppTagUncheckedCreateWithoutLinksInputObjectSchema)])
}).strict();
export const AppTagCreateOrConnectWithoutLinksInputObjectSchema: z.ZodType<Prisma.AppTagCreateOrConnectWithoutLinksInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagCreateOrConnectWithoutLinksInput>;
export const AppTagCreateOrConnectWithoutLinksInputObjectZodSchema = makeSchema();

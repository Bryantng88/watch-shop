import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagCreateWithoutLinksInputObjectSchema as AppTagCreateWithoutLinksInputObjectSchema } from './AppTagCreateWithoutLinksInput.schema';
import { AppTagUncheckedCreateWithoutLinksInputObjectSchema as AppTagUncheckedCreateWithoutLinksInputObjectSchema } from './AppTagUncheckedCreateWithoutLinksInput.schema';
import { AppTagCreateOrConnectWithoutLinksInputObjectSchema as AppTagCreateOrConnectWithoutLinksInputObjectSchema } from './AppTagCreateOrConnectWithoutLinksInput.schema';
import { AppTagWhereUniqueInputObjectSchema as AppTagWhereUniqueInputObjectSchema } from './AppTagWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AppTagCreateWithoutLinksInputObjectSchema), z.lazy(() => AppTagUncheckedCreateWithoutLinksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AppTagCreateOrConnectWithoutLinksInputObjectSchema).optional(),
  connect: z.lazy(() => AppTagWhereUniqueInputObjectSchema).optional()
}).strict();
export const AppTagCreateNestedOneWithoutLinksInputObjectSchema: z.ZodType<Prisma.AppTagCreateNestedOneWithoutLinksInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagCreateNestedOneWithoutLinksInput>;
export const AppTagCreateNestedOneWithoutLinksInputObjectZodSchema = makeSchema();

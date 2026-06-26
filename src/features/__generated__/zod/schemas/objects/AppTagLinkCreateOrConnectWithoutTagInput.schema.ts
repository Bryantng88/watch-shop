import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagLinkWhereUniqueInputObjectSchema as AppTagLinkWhereUniqueInputObjectSchema } from './AppTagLinkWhereUniqueInput.schema';
import { AppTagLinkCreateWithoutTagInputObjectSchema as AppTagLinkCreateWithoutTagInputObjectSchema } from './AppTagLinkCreateWithoutTagInput.schema';
import { AppTagLinkUncheckedCreateWithoutTagInputObjectSchema as AppTagLinkUncheckedCreateWithoutTagInputObjectSchema } from './AppTagLinkUncheckedCreateWithoutTagInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AppTagLinkWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AppTagLinkCreateWithoutTagInputObjectSchema), z.lazy(() => AppTagLinkUncheckedCreateWithoutTagInputObjectSchema)])
}).strict();
export const AppTagLinkCreateOrConnectWithoutTagInputObjectSchema: z.ZodType<Prisma.AppTagLinkCreateOrConnectWithoutTagInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkCreateOrConnectWithoutTagInput>;
export const AppTagLinkCreateOrConnectWithoutTagInputObjectZodSchema = makeSchema();

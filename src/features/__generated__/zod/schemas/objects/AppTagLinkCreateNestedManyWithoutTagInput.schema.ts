import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagLinkCreateWithoutTagInputObjectSchema as AppTagLinkCreateWithoutTagInputObjectSchema } from './AppTagLinkCreateWithoutTagInput.schema';
import { AppTagLinkUncheckedCreateWithoutTagInputObjectSchema as AppTagLinkUncheckedCreateWithoutTagInputObjectSchema } from './AppTagLinkUncheckedCreateWithoutTagInput.schema';
import { AppTagLinkCreateOrConnectWithoutTagInputObjectSchema as AppTagLinkCreateOrConnectWithoutTagInputObjectSchema } from './AppTagLinkCreateOrConnectWithoutTagInput.schema';
import { AppTagLinkCreateManyTagInputEnvelopeObjectSchema as AppTagLinkCreateManyTagInputEnvelopeObjectSchema } from './AppTagLinkCreateManyTagInputEnvelope.schema';
import { AppTagLinkWhereUniqueInputObjectSchema as AppTagLinkWhereUniqueInputObjectSchema } from './AppTagLinkWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AppTagLinkCreateWithoutTagInputObjectSchema), z.lazy(() => AppTagLinkCreateWithoutTagInputObjectSchema).array(), z.lazy(() => AppTagLinkUncheckedCreateWithoutTagInputObjectSchema), z.lazy(() => AppTagLinkUncheckedCreateWithoutTagInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AppTagLinkCreateOrConnectWithoutTagInputObjectSchema), z.lazy(() => AppTagLinkCreateOrConnectWithoutTagInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AppTagLinkCreateManyTagInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AppTagLinkWhereUniqueInputObjectSchema), z.lazy(() => AppTagLinkWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const AppTagLinkCreateNestedManyWithoutTagInputObjectSchema: z.ZodType<Prisma.AppTagLinkCreateNestedManyWithoutTagInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkCreateNestedManyWithoutTagInput>;
export const AppTagLinkCreateNestedManyWithoutTagInputObjectZodSchema = makeSchema();

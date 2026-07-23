import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationWhereUniqueInputObjectSchema as MediaOperationWhereUniqueInputObjectSchema } from './MediaOperationWhereUniqueInput.schema';
import { MediaOperationCreateWithoutMediaObjectInputObjectSchema as MediaOperationCreateWithoutMediaObjectInputObjectSchema } from './MediaOperationCreateWithoutMediaObjectInput.schema';
import { MediaOperationUncheckedCreateWithoutMediaObjectInputObjectSchema as MediaOperationUncheckedCreateWithoutMediaObjectInputObjectSchema } from './MediaOperationUncheckedCreateWithoutMediaObjectInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MediaOperationWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MediaOperationCreateWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaOperationUncheckedCreateWithoutMediaObjectInputObjectSchema)])
}).strict();
export const MediaOperationCreateOrConnectWithoutMediaObjectInputObjectSchema: z.ZodType<Prisma.MediaOperationCreateOrConnectWithoutMediaObjectInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationCreateOrConnectWithoutMediaObjectInput>;
export const MediaOperationCreateOrConnectWithoutMediaObjectInputObjectZodSchema = makeSchema();

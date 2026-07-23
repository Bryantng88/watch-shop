import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationWhereUniqueInputObjectSchema as MediaOperationWhereUniqueInputObjectSchema } from './MediaOperationWhereUniqueInput.schema';
import { MediaOperationUpdateWithoutMediaObjectInputObjectSchema as MediaOperationUpdateWithoutMediaObjectInputObjectSchema } from './MediaOperationUpdateWithoutMediaObjectInput.schema';
import { MediaOperationUncheckedUpdateWithoutMediaObjectInputObjectSchema as MediaOperationUncheckedUpdateWithoutMediaObjectInputObjectSchema } from './MediaOperationUncheckedUpdateWithoutMediaObjectInput.schema';
import { MediaOperationCreateWithoutMediaObjectInputObjectSchema as MediaOperationCreateWithoutMediaObjectInputObjectSchema } from './MediaOperationCreateWithoutMediaObjectInput.schema';
import { MediaOperationUncheckedCreateWithoutMediaObjectInputObjectSchema as MediaOperationUncheckedCreateWithoutMediaObjectInputObjectSchema } from './MediaOperationUncheckedCreateWithoutMediaObjectInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MediaOperationWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MediaOperationUpdateWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaOperationUncheckedUpdateWithoutMediaObjectInputObjectSchema)]),
  create: z.union([z.lazy(() => MediaOperationCreateWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaOperationUncheckedCreateWithoutMediaObjectInputObjectSchema)])
}).strict();
export const MediaOperationUpsertWithWhereUniqueWithoutMediaObjectInputObjectSchema: z.ZodType<Prisma.MediaOperationUpsertWithWhereUniqueWithoutMediaObjectInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationUpsertWithWhereUniqueWithoutMediaObjectInput>;
export const MediaOperationUpsertWithWhereUniqueWithoutMediaObjectInputObjectZodSchema = makeSchema();

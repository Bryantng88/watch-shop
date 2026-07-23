import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectUpdateWithoutOperationsInputObjectSchema as MediaObjectUpdateWithoutOperationsInputObjectSchema } from './MediaObjectUpdateWithoutOperationsInput.schema';
import { MediaObjectUncheckedUpdateWithoutOperationsInputObjectSchema as MediaObjectUncheckedUpdateWithoutOperationsInputObjectSchema } from './MediaObjectUncheckedUpdateWithoutOperationsInput.schema';
import { MediaObjectCreateWithoutOperationsInputObjectSchema as MediaObjectCreateWithoutOperationsInputObjectSchema } from './MediaObjectCreateWithoutOperationsInput.schema';
import { MediaObjectUncheckedCreateWithoutOperationsInputObjectSchema as MediaObjectUncheckedCreateWithoutOperationsInputObjectSchema } from './MediaObjectUncheckedCreateWithoutOperationsInput.schema';
import { MediaObjectWhereInputObjectSchema as MediaObjectWhereInputObjectSchema } from './MediaObjectWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => MediaObjectUpdateWithoutOperationsInputObjectSchema), z.lazy(() => MediaObjectUncheckedUpdateWithoutOperationsInputObjectSchema)]),
  create: z.union([z.lazy(() => MediaObjectCreateWithoutOperationsInputObjectSchema), z.lazy(() => MediaObjectUncheckedCreateWithoutOperationsInputObjectSchema)]),
  where: z.lazy(() => MediaObjectWhereInputObjectSchema).optional()
}).strict();
export const MediaObjectUpsertWithoutOperationsInputObjectSchema: z.ZodType<Prisma.MediaObjectUpsertWithoutOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectUpsertWithoutOperationsInput>;
export const MediaObjectUpsertWithoutOperationsInputObjectZodSchema = makeSchema();

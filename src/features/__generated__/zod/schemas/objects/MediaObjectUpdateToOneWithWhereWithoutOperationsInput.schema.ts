import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectWhereInputObjectSchema as MediaObjectWhereInputObjectSchema } from './MediaObjectWhereInput.schema';
import { MediaObjectUpdateWithoutOperationsInputObjectSchema as MediaObjectUpdateWithoutOperationsInputObjectSchema } from './MediaObjectUpdateWithoutOperationsInput.schema';
import { MediaObjectUncheckedUpdateWithoutOperationsInputObjectSchema as MediaObjectUncheckedUpdateWithoutOperationsInputObjectSchema } from './MediaObjectUncheckedUpdateWithoutOperationsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MediaObjectWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => MediaObjectUpdateWithoutOperationsInputObjectSchema), z.lazy(() => MediaObjectUncheckedUpdateWithoutOperationsInputObjectSchema)])
}).strict();
export const MediaObjectUpdateToOneWithWhereWithoutOperationsInputObjectSchema: z.ZodType<Prisma.MediaObjectUpdateToOneWithWhereWithoutOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectUpdateToOneWithWhereWithoutOperationsInput>;
export const MediaObjectUpdateToOneWithWhereWithoutOperationsInputObjectZodSchema = makeSchema();

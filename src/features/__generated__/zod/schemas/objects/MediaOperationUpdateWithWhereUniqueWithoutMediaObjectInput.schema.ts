import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationWhereUniqueInputObjectSchema as MediaOperationWhereUniqueInputObjectSchema } from './MediaOperationWhereUniqueInput.schema';
import { MediaOperationUpdateWithoutMediaObjectInputObjectSchema as MediaOperationUpdateWithoutMediaObjectInputObjectSchema } from './MediaOperationUpdateWithoutMediaObjectInput.schema';
import { MediaOperationUncheckedUpdateWithoutMediaObjectInputObjectSchema as MediaOperationUncheckedUpdateWithoutMediaObjectInputObjectSchema } from './MediaOperationUncheckedUpdateWithoutMediaObjectInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MediaOperationWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MediaOperationUpdateWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaOperationUncheckedUpdateWithoutMediaObjectInputObjectSchema)])
}).strict();
export const MediaOperationUpdateWithWhereUniqueWithoutMediaObjectInputObjectSchema: z.ZodType<Prisma.MediaOperationUpdateWithWhereUniqueWithoutMediaObjectInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationUpdateWithWhereUniqueWithoutMediaObjectInput>;
export const MediaOperationUpdateWithWhereUniqueWithoutMediaObjectInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationScalarWhereInputObjectSchema as MediaOperationScalarWhereInputObjectSchema } from './MediaOperationScalarWhereInput.schema';
import { MediaOperationUpdateManyMutationInputObjectSchema as MediaOperationUpdateManyMutationInputObjectSchema } from './MediaOperationUpdateManyMutationInput.schema';
import { MediaOperationUncheckedUpdateManyWithoutMediaObjectInputObjectSchema as MediaOperationUncheckedUpdateManyWithoutMediaObjectInputObjectSchema } from './MediaOperationUncheckedUpdateManyWithoutMediaObjectInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MediaOperationScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => MediaOperationUpdateManyMutationInputObjectSchema), z.lazy(() => MediaOperationUncheckedUpdateManyWithoutMediaObjectInputObjectSchema)])
}).strict();
export const MediaOperationUpdateManyWithWhereWithoutMediaObjectInputObjectSchema: z.ZodType<Prisma.MediaOperationUpdateManyWithWhereWithoutMediaObjectInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationUpdateManyWithWhereWithoutMediaObjectInput>;
export const MediaOperationUpdateManyWithWhereWithoutMediaObjectInputObjectZodSchema = makeSchema();

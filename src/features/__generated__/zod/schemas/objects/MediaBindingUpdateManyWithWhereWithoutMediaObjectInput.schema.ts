import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaBindingScalarWhereInputObjectSchema as MediaBindingScalarWhereInputObjectSchema } from './MediaBindingScalarWhereInput.schema';
import { MediaBindingUpdateManyMutationInputObjectSchema as MediaBindingUpdateManyMutationInputObjectSchema } from './MediaBindingUpdateManyMutationInput.schema';
import { MediaBindingUncheckedUpdateManyWithoutMediaObjectInputObjectSchema as MediaBindingUncheckedUpdateManyWithoutMediaObjectInputObjectSchema } from './MediaBindingUncheckedUpdateManyWithoutMediaObjectInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MediaBindingScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => MediaBindingUpdateManyMutationInputObjectSchema), z.lazy(() => MediaBindingUncheckedUpdateManyWithoutMediaObjectInputObjectSchema)])
}).strict();
export const MediaBindingUpdateManyWithWhereWithoutMediaObjectInputObjectSchema: z.ZodType<Prisma.MediaBindingUpdateManyWithWhereWithoutMediaObjectInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingUpdateManyWithWhereWithoutMediaObjectInput>;
export const MediaBindingUpdateManyWithWhereWithoutMediaObjectInputObjectZodSchema = makeSchema();

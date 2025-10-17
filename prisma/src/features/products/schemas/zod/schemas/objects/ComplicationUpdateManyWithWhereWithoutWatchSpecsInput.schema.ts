import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ComplicationScalarWhereInputObjectSchema as ComplicationScalarWhereInputObjectSchema } from './ComplicationScalarWhereInput.schema';
import { ComplicationUpdateManyMutationInputObjectSchema as ComplicationUpdateManyMutationInputObjectSchema } from './ComplicationUpdateManyMutationInput.schema';
import { ComplicationUncheckedUpdateManyWithoutWatchSpecsInputObjectSchema as ComplicationUncheckedUpdateManyWithoutWatchSpecsInputObjectSchema } from './ComplicationUncheckedUpdateManyWithoutWatchSpecsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ComplicationScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ComplicationUpdateManyMutationInputObjectSchema), z.lazy(() => ComplicationUncheckedUpdateManyWithoutWatchSpecsInputObjectSchema)])
}).strict();
export const ComplicationUpdateManyWithWhereWithoutWatchSpecsInputObjectSchema: z.ZodType<Prisma.ComplicationUpdateManyWithWhereWithoutWatchSpecsInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationUpdateManyWithWhereWithoutWatchSpecsInput>;
export const ComplicationUpdateManyWithWhereWithoutWatchSpecsInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ComplicationScalarWhereInputObjectSchema as ComplicationScalarWhereInputObjectSchema } from './ComplicationScalarWhereInput.schema';
import { ComplicationUpdateManyMutationInputObjectSchema as ComplicationUpdateManyMutationInputObjectSchema } from './ComplicationUpdateManyMutationInput.schema';
import { ComplicationUncheckedUpdateManyWithoutWatchSpecInputObjectSchema as ComplicationUncheckedUpdateManyWithoutWatchSpecInputObjectSchema } from './ComplicationUncheckedUpdateManyWithoutWatchSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ComplicationScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ComplicationUpdateManyMutationInputObjectSchema), z.lazy(() => ComplicationUncheckedUpdateManyWithoutWatchSpecInputObjectSchema)])
}).strict();
export const ComplicationUpdateManyWithWhereWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.ComplicationUpdateManyWithWhereWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationUpdateManyWithWhereWithoutWatchSpecInput>;
export const ComplicationUpdateManyWithWhereWithoutWatchSpecInputObjectZodSchema = makeSchema();

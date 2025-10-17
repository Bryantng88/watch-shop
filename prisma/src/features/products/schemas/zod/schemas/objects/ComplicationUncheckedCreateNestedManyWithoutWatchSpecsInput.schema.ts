import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ComplicationCreateWithoutWatchSpecsInputObjectSchema as ComplicationCreateWithoutWatchSpecsInputObjectSchema } from './ComplicationCreateWithoutWatchSpecsInput.schema';
import { ComplicationUncheckedCreateWithoutWatchSpecsInputObjectSchema as ComplicationUncheckedCreateWithoutWatchSpecsInputObjectSchema } from './ComplicationUncheckedCreateWithoutWatchSpecsInput.schema';
import { ComplicationCreateOrConnectWithoutWatchSpecsInputObjectSchema as ComplicationCreateOrConnectWithoutWatchSpecsInputObjectSchema } from './ComplicationCreateOrConnectWithoutWatchSpecsInput.schema';
import { ComplicationWhereUniqueInputObjectSchema as ComplicationWhereUniqueInputObjectSchema } from './ComplicationWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ComplicationCreateWithoutWatchSpecsInputObjectSchema), z.lazy(() => ComplicationCreateWithoutWatchSpecsInputObjectSchema).array(), z.lazy(() => ComplicationUncheckedCreateWithoutWatchSpecsInputObjectSchema), z.lazy(() => ComplicationUncheckedCreateWithoutWatchSpecsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ComplicationCreateOrConnectWithoutWatchSpecsInputObjectSchema), z.lazy(() => ComplicationCreateOrConnectWithoutWatchSpecsInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ComplicationWhereUniqueInputObjectSchema), z.lazy(() => ComplicationWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ComplicationUncheckedCreateNestedManyWithoutWatchSpecsInputObjectSchema: z.ZodType<Prisma.ComplicationUncheckedCreateNestedManyWithoutWatchSpecsInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationUncheckedCreateNestedManyWithoutWatchSpecsInput>;
export const ComplicationUncheckedCreateNestedManyWithoutWatchSpecsInputObjectZodSchema = makeSchema();

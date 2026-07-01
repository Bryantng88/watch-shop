import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityCreateWithoutActorUserInputObjectSchema as TaskItemActivityCreateWithoutActorUserInputObjectSchema } from './TaskItemActivityCreateWithoutActorUserInput.schema';
import { TaskItemActivityUncheckedCreateWithoutActorUserInputObjectSchema as TaskItemActivityUncheckedCreateWithoutActorUserInputObjectSchema } from './TaskItemActivityUncheckedCreateWithoutActorUserInput.schema';
import { TaskItemActivityCreateOrConnectWithoutActorUserInputObjectSchema as TaskItemActivityCreateOrConnectWithoutActorUserInputObjectSchema } from './TaskItemActivityCreateOrConnectWithoutActorUserInput.schema';
import { TaskItemActivityCreateManyActorUserInputEnvelopeObjectSchema as TaskItemActivityCreateManyActorUserInputEnvelopeObjectSchema } from './TaskItemActivityCreateManyActorUserInputEnvelope.schema';
import { TaskItemActivityWhereUniqueInputObjectSchema as TaskItemActivityWhereUniqueInputObjectSchema } from './TaskItemActivityWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemActivityCreateWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityCreateWithoutActorUserInputObjectSchema).array(), z.lazy(() => TaskItemActivityUncheckedCreateWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedCreateWithoutActorUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskItemActivityCreateOrConnectWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityCreateOrConnectWithoutActorUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskItemActivityCreateManyActorUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskItemActivityUncheckedCreateNestedManyWithoutActorUserInputObjectSchema: z.ZodType<Prisma.TaskItemActivityUncheckedCreateNestedManyWithoutActorUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityUncheckedCreateNestedManyWithoutActorUserInput>;
export const TaskItemActivityUncheckedCreateNestedManyWithoutActorUserInputObjectZodSchema = makeSchema();

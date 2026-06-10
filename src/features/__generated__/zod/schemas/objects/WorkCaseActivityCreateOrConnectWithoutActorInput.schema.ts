import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseActivityWhereUniqueInputObjectSchema as WorkCaseActivityWhereUniqueInputObjectSchema } from './WorkCaseActivityWhereUniqueInput.schema';
import { WorkCaseActivityCreateWithoutActorInputObjectSchema as WorkCaseActivityCreateWithoutActorInputObjectSchema } from './WorkCaseActivityCreateWithoutActorInput.schema';
import { WorkCaseActivityUncheckedCreateWithoutActorInputObjectSchema as WorkCaseActivityUncheckedCreateWithoutActorInputObjectSchema } from './WorkCaseActivityUncheckedCreateWithoutActorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkCaseActivityCreateWithoutActorInputObjectSchema), z.lazy(() => WorkCaseActivityUncheckedCreateWithoutActorInputObjectSchema)])
}).strict();
export const WorkCaseActivityCreateOrConnectWithoutActorInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityCreateOrConnectWithoutActorInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityCreateOrConnectWithoutActorInput>;
export const WorkCaseActivityCreateOrConnectWithoutActorInputObjectZodSchema = makeSchema();

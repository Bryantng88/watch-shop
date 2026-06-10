import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseActivityWhereUniqueInputObjectSchema as WorkCaseActivityWhereUniqueInputObjectSchema } from './WorkCaseActivityWhereUniqueInput.schema';
import { WorkCaseActivityUpdateWithoutActorInputObjectSchema as WorkCaseActivityUpdateWithoutActorInputObjectSchema } from './WorkCaseActivityUpdateWithoutActorInput.schema';
import { WorkCaseActivityUncheckedUpdateWithoutActorInputObjectSchema as WorkCaseActivityUncheckedUpdateWithoutActorInputObjectSchema } from './WorkCaseActivityUncheckedUpdateWithoutActorInput.schema';
import { WorkCaseActivityCreateWithoutActorInputObjectSchema as WorkCaseActivityCreateWithoutActorInputObjectSchema } from './WorkCaseActivityCreateWithoutActorInput.schema';
import { WorkCaseActivityUncheckedCreateWithoutActorInputObjectSchema as WorkCaseActivityUncheckedCreateWithoutActorInputObjectSchema } from './WorkCaseActivityUncheckedCreateWithoutActorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WorkCaseActivityUpdateWithoutActorInputObjectSchema), z.lazy(() => WorkCaseActivityUncheckedUpdateWithoutActorInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkCaseActivityCreateWithoutActorInputObjectSchema), z.lazy(() => WorkCaseActivityUncheckedCreateWithoutActorInputObjectSchema)])
}).strict();
export const WorkCaseActivityUpsertWithWhereUniqueWithoutActorInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityUpsertWithWhereUniqueWithoutActorInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityUpsertWithWhereUniqueWithoutActorInput>;
export const WorkCaseActivityUpsertWithWhereUniqueWithoutActorInputObjectZodSchema = makeSchema();

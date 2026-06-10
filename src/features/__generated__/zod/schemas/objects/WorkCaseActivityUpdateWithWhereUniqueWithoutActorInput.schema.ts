import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseActivityWhereUniqueInputObjectSchema as WorkCaseActivityWhereUniqueInputObjectSchema } from './WorkCaseActivityWhereUniqueInput.schema';
import { WorkCaseActivityUpdateWithoutActorInputObjectSchema as WorkCaseActivityUpdateWithoutActorInputObjectSchema } from './WorkCaseActivityUpdateWithoutActorInput.schema';
import { WorkCaseActivityUncheckedUpdateWithoutActorInputObjectSchema as WorkCaseActivityUncheckedUpdateWithoutActorInputObjectSchema } from './WorkCaseActivityUncheckedUpdateWithoutActorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WorkCaseActivityUpdateWithoutActorInputObjectSchema), z.lazy(() => WorkCaseActivityUncheckedUpdateWithoutActorInputObjectSchema)])
}).strict();
export const WorkCaseActivityUpdateWithWhereUniqueWithoutActorInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityUpdateWithWhereUniqueWithoutActorInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityUpdateWithWhereUniqueWithoutActorInput>;
export const WorkCaseActivityUpdateWithWhereUniqueWithoutActorInputObjectZodSchema = makeSchema();

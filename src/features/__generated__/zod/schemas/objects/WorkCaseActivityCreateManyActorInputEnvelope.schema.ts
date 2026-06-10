import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseActivityCreateManyActorInputObjectSchema as WorkCaseActivityCreateManyActorInputObjectSchema } from './WorkCaseActivityCreateManyActorInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => WorkCaseActivityCreateManyActorInputObjectSchema), z.lazy(() => WorkCaseActivityCreateManyActorInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const WorkCaseActivityCreateManyActorInputEnvelopeObjectSchema: z.ZodType<Prisma.WorkCaseActivityCreateManyActorInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityCreateManyActorInputEnvelope>;
export const WorkCaseActivityCreateManyActorInputEnvelopeObjectZodSchema = makeSchema();

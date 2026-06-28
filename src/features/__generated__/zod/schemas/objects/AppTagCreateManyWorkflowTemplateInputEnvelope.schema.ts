import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagCreateManyWorkflowTemplateInputObjectSchema as AppTagCreateManyWorkflowTemplateInputObjectSchema } from './AppTagCreateManyWorkflowTemplateInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => AppTagCreateManyWorkflowTemplateInputObjectSchema), z.lazy(() => AppTagCreateManyWorkflowTemplateInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const AppTagCreateManyWorkflowTemplateInputEnvelopeObjectSchema: z.ZodType<Prisma.AppTagCreateManyWorkflowTemplateInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.AppTagCreateManyWorkflowTemplateInputEnvelope>;
export const AppTagCreateManyWorkflowTemplateInputEnvelopeObjectZodSchema = makeSchema();

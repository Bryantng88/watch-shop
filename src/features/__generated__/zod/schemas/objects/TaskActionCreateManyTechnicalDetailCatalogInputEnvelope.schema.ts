import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCreateManyTechnicalDetailCatalogInputObjectSchema as TaskActionCreateManyTechnicalDetailCatalogInputObjectSchema } from './TaskActionCreateManyTechnicalDetailCatalogInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskActionCreateManyTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TaskActionCreateManyTechnicalDetailCatalogInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskActionCreateManyTechnicalDetailCatalogInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskActionCreateManyTechnicalDetailCatalogInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionCreateManyTechnicalDetailCatalogInputEnvelope>;
export const TaskActionCreateManyTechnicalDetailCatalogInputEnvelopeObjectZodSchema = makeSchema();

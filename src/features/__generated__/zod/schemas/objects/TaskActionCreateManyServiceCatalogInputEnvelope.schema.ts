import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCreateManyServiceCatalogInputObjectSchema as TaskActionCreateManyServiceCatalogInputObjectSchema } from './TaskActionCreateManyServiceCatalogInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskActionCreateManyServiceCatalogInputObjectSchema), z.lazy(() => TaskActionCreateManyServiceCatalogInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskActionCreateManyServiceCatalogInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskActionCreateManyServiceCatalogInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionCreateManyServiceCatalogInputEnvelope>;
export const TaskActionCreateManyServiceCatalogInputEnvelopeObjectZodSchema = makeSchema();

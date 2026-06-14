import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCreateManyMechanicalPartCatalogInputObjectSchema as TaskActionCreateManyMechanicalPartCatalogInputObjectSchema } from './TaskActionCreateManyMechanicalPartCatalogInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskActionCreateManyMechanicalPartCatalogInputObjectSchema), z.lazy(() => TaskActionCreateManyMechanicalPartCatalogInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskActionCreateManyMechanicalPartCatalogInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskActionCreateManyMechanicalPartCatalogInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionCreateManyMechanicalPartCatalogInputEnvelope>;
export const TaskActionCreateManyMechanicalPartCatalogInputEnvelopeObjectZodSchema = makeSchema();

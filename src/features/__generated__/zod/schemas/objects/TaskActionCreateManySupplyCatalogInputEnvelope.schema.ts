import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCreateManySupplyCatalogInputObjectSchema as TaskActionCreateManySupplyCatalogInputObjectSchema } from './TaskActionCreateManySupplyCatalogInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskActionCreateManySupplyCatalogInputObjectSchema), z.lazy(() => TaskActionCreateManySupplyCatalogInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskActionCreateManySupplyCatalogInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskActionCreateManySupplyCatalogInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionCreateManySupplyCatalogInputEnvelope>;
export const TaskActionCreateManySupplyCatalogInputEnvelopeObjectZodSchema = makeSchema();

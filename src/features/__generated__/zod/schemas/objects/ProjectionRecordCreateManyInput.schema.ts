import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  projectionKey: z.string(),
  projectionVersion: z.number().int(),
  rowKey: z.string(),
  workspaceId: z.string().optional().nullable(),
  spaceId: z.string().optional().nullable(),
  entityType: z.string().optional().nullable(),
  entityId: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  searchText: z.string().optional().nullable(),
  sortAt: z.coerce.date().optional().nullable(),
  dataJson: z.union([JsonNullValueInputSchema, jsonSchema]),
  sourceUpdatedAt: z.coerce.date().optional().nullable(),
  projectedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const ProjectionRecordCreateManyInputObjectSchema: z.ZodType<Prisma.ProjectionRecordCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionRecordCreateManyInput>;
export const ProjectionRecordCreateManyInputObjectZodSchema = makeSchema();

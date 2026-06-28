import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  slug: z.literal(true).optional(),
  color: z.literal(true).optional(),
  scope: z.literal(true).optional(),
  ownerType: z.literal(true).optional(),
  ownerId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  workflowTemplateId: z.literal(true).optional()
}).strict();
export const AppTagMaxAggregateInputObjectSchema: z.ZodType<Prisma.AppTagMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.AppTagMaxAggregateInputType>;
export const AppTagMaxAggregateInputObjectZodSchema = makeSchema();

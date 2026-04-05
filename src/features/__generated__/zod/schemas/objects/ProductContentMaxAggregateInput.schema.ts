import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  productId: z.literal(true).optional(),
  titleSnapshot: z.literal(true).optional(),
  brandSnapshot: z.literal(true).optional(),
  refSnapshot: z.literal(true).optional(),
  sizeSnapshot: z.literal(true).optional(),
  movementSnapshot: z.literal(true).optional(),
  glassSnapshot: z.literal(true).optional(),
  strapClaspSnapshot: z.literal(true).optional(),
  modelSnapshot: z.literal(true).optional(),
  yearSnapshot: z.literal(true).optional(),
  generatedContent: z.literal(true).optional(),
  promptNote: z.literal(true).optional(),
  generatedAt: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const ProductContentMaxAggregateInputObjectSchema: z.ZodType<Prisma.ProductContentMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProductContentMaxAggregateInputType>;
export const ProductContentMaxAggregateInputObjectZodSchema = makeSchema();

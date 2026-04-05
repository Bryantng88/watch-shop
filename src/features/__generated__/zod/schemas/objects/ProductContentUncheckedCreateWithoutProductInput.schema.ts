import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  titleSnapshot: z.string().optional().nullable(),
  brandSnapshot: z.string().optional().nullable(),
  refSnapshot: z.string().optional().nullable(),
  sizeSnapshot: z.string().optional().nullable(),
  movementSnapshot: z.string().optional().nullable(),
  glassSnapshot: z.string().optional().nullable(),
  strapClaspSnapshot: z.string().optional().nullable(),
  modelSnapshot: z.string().optional().nullable(),
  yearSnapshot: z.string().optional().nullable(),
  generatedContent: z.string().optional().nullable(),
  promptNote: z.string().optional().nullable(),
  generatedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const ProductContentUncheckedCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductContentUncheckedCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductContentUncheckedCreateWithoutProductInput>;
export const ProductContentUncheckedCreateWithoutProductInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetCreateNestedManyWithoutPostTargetInputObjectSchema as ProductPostTargetCreateNestedManyWithoutPostTargetInputObjectSchema } from './ProductPostTargetCreateNestedManyWithoutPostTargetInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  platform: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  products: z.lazy(() => ProductPostTargetCreateNestedManyWithoutPostTargetInputObjectSchema)
}).strict();
export const PostTargetCreateInputObjectSchema: z.ZodType<Prisma.PostTargetCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.PostTargetCreateInput>;
export const PostTargetCreateInputObjectZodSchema = makeSchema();

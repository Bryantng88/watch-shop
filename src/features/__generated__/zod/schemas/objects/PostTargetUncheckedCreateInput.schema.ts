import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetUncheckedCreateNestedManyWithoutPostTargetInputObjectSchema as ProductPostTargetUncheckedCreateNestedManyWithoutPostTargetInputObjectSchema } from './ProductPostTargetUncheckedCreateNestedManyWithoutPostTargetInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  platform: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  products: z.lazy(() => ProductPostTargetUncheckedCreateNestedManyWithoutPostTargetInputObjectSchema)
}).strict();
export const PostTargetUncheckedCreateInputObjectSchema: z.ZodType<Prisma.PostTargetUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.PostTargetUncheckedCreateInput>;
export const PostTargetUncheckedCreateInputObjectZodSchema = makeSchema();

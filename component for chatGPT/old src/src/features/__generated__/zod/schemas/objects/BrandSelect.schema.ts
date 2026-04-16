import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductFindManySchema as ProductFindManySchema } from '../findManyProduct.schema';
import { BrandCountOutputTypeArgsObjectSchema as BrandCountOutputTypeArgsObjectSchema } from './BrandCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  slug: z.boolean().optional(),
  country: z.boolean().optional(),
  foundedYear: z.boolean().optional(),
  website: z.boolean().optional(),
  logoUrl: z.boolean().optional(),
  isAuthorized: z.boolean().optional(),
  status: z.boolean().optional(),
  description: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  products: z.union([z.boolean(), z.lazy(() => ProductFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => BrandCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const BrandSelectObjectSchema: z.ZodType<Prisma.BrandSelect> = makeSchema() as unknown as z.ZodType<Prisma.BrandSelect>;
export const BrandSelectObjectZodSchema = makeSchema();

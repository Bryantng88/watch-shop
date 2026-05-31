import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  products: z.boolean().optional()
}).strict();
export const PostTargetCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.PostTargetCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.PostTargetCountOutputTypeSelect>;
export const PostTargetCountOutputTypeSelectObjectZodSchema = makeSchema();

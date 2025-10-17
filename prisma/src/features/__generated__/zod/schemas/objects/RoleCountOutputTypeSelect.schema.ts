import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  permissions: z.boolean().optional(),
  users: z.boolean().optional()
}).strict();
export const RoleCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.RoleCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.RoleCountOutputTypeSelect>;
export const RoleCountOutputTypeSelectObjectZodSchema = makeSchema();

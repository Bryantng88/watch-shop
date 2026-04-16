import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  roles: z.boolean().optional()
}).strict();
export const PermissionCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.PermissionCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.PermissionCountOutputTypeSelect>;
export const PermissionCountOutputTypeSelectObjectZodSchema = makeSchema();

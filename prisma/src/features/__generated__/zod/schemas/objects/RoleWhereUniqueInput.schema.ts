import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().optional()
}).strict();
export const RoleWhereUniqueInputObjectSchema: z.ZodType<Prisma.RoleWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleWhereUniqueInput>;
export const RoleWhereUniqueInputObjectZodSchema = makeSchema();

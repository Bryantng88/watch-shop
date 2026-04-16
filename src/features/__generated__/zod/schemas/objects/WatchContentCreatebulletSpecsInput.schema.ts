import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  set: z.string().array()
}).strict();
export const WatchContentCreatebulletSpecsInputObjectSchema: z.ZodType<Prisma.WatchContentCreatebulletSpecsInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchContentCreatebulletSpecsInput>;
export const WatchContentCreatebulletSpecsInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const WatchStrapInstallationWhereUniqueInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationWhereUniqueInput>;
export const WatchStrapInstallationWhereUniqueInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const ServiceRequestWhereUniqueInputObjectSchema: z.ZodType<Prisma.ServiceRequestWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestWhereUniqueInput>;
export const ServiceRequestWhereUniqueInputObjectZodSchema = makeSchema();

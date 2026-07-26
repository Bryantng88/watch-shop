import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  idempotencyKey: z.string().optional()
}).strict();
export const ProjectionEventDeliveryWhereUniqueInputObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryWhereUniqueInput>;
export const ProjectionEventDeliveryWhereUniqueInputObjectZodSchema = makeSchema();

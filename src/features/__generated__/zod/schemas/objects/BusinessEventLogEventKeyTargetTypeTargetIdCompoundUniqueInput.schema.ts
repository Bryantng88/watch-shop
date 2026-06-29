import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  eventKey: z.string(),
  targetType: z.string(),
  targetId: z.string()
}).strict();
export const BusinessEventLogEventKeyTargetTypeTargetIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.BusinessEventLogEventKeyTargetTypeTargetIdCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogEventKeyTargetTypeTargetIdCompoundUniqueInput>;
export const BusinessEventLogEventKeyTargetTypeTargetIdCompoundUniqueInputObjectZodSchema = makeSchema();

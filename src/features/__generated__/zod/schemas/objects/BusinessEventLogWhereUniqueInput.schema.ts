import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BusinessEventLogEventKeyTargetTypeTargetIdCompoundUniqueInputObjectSchema as BusinessEventLogEventKeyTargetTypeTargetIdCompoundUniqueInputObjectSchema } from './BusinessEventLogEventKeyTargetTypeTargetIdCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  eventKey_targetType_targetId: z.lazy(() => BusinessEventLogEventKeyTargetTypeTargetIdCompoundUniqueInputObjectSchema).optional()
}).strict();
export const BusinessEventLogWhereUniqueInputObjectSchema: z.ZodType<Prisma.BusinessEventLogWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogWhereUniqueInput>;
export const BusinessEventLogWhereUniqueInputObjectZodSchema = makeSchema();

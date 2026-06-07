import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NotificationCreateManyTaskInputObjectSchema as NotificationCreateManyTaskInputObjectSchema } from './NotificationCreateManyTaskInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => NotificationCreateManyTaskInputObjectSchema), z.lazy(() => NotificationCreateManyTaskInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const NotificationCreateManyTaskInputEnvelopeObjectSchema: z.ZodType<Prisma.NotificationCreateManyTaskInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.NotificationCreateManyTaskInputEnvelope>;
export const NotificationCreateManyTaskInputEnvelopeObjectZodSchema = makeSchema();

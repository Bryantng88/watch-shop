import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartCreateManyVariantInputObjectSchema as MaintenancePartCreateManyVariantInputObjectSchema } from './MaintenancePartCreateManyVariantInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => MaintenancePartCreateManyVariantInputObjectSchema), z.lazy(() => MaintenancePartCreateManyVariantInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const MaintenancePartCreateManyVariantInputEnvelopeObjectSchema: z.ZodType<Prisma.MaintenancePartCreateManyVariantInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCreateManyVariantInputEnvelope>;
export const MaintenancePartCreateManyVariantInputEnvelopeObjectZodSchema = makeSchema();

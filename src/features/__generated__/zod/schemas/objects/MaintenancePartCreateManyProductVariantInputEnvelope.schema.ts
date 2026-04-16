import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartCreateManyProductVariantInputObjectSchema as MaintenancePartCreateManyProductVariantInputObjectSchema } from './MaintenancePartCreateManyProductVariantInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => MaintenancePartCreateManyProductVariantInputObjectSchema), z.lazy(() => MaintenancePartCreateManyProductVariantInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const MaintenancePartCreateManyProductVariantInputEnvelopeObjectSchema: z.ZodType<Prisma.MaintenancePartCreateManyProductVariantInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCreateManyProductVariantInputEnvelope>;
export const MaintenancePartCreateManyProductVariantInputEnvelopeObjectZodSchema = makeSchema();

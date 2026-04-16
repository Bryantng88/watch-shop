import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemKindSchema } from '../enums/AcquisitionItemKind.schema'

const makeSchema = () => z.object({
  set: AcquisitionItemKindSchema.optional()
}).strict();
export const NullableEnumAcquisitionItemKindFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumAcquisitionItemKindFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumAcquisitionItemKindFieldUpdateOperationsInput>;
export const NullableEnumAcquisitionItemKindFieldUpdateOperationsInputObjectZodSchema = makeSchema();

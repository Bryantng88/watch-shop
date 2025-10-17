import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorRoleSchema } from '../enums/VendorRole.schema'

const makeSchema = () => z.object({
  set: VendorRoleSchema.optional()
}).strict();
export const EnumVendorRoleFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumVendorRoleFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumVendorRoleFieldUpdateOperationsInput>;
export const EnumVendorRoleFieldUpdateOperationsInputObjectZodSchema = makeSchema();

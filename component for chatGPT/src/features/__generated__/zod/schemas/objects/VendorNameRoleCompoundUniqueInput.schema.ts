import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorRoleSchema } from '../enums/VendorRole.schema'

const makeSchema = () => z.object({
  name: z.string(),
  role: VendorRoleSchema
}).strict();
export const VendorNameRoleCompoundUniqueInputObjectSchema: z.ZodType<Prisma.VendorNameRoleCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorNameRoleCompoundUniqueInput>;
export const VendorNameRoleCompoundUniqueInputObjectZodSchema = makeSchema();

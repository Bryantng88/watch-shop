import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorNameRoleCompoundUniqueInputObjectSchema as VendorNameRoleCompoundUniqueInputObjectSchema } from './VendorNameRoleCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name_role: z.lazy(() => VendorNameRoleCompoundUniqueInputObjectSchema).optional()
}).strict();
export const VendorWhereUniqueInputObjectSchema: z.ZodType<Prisma.VendorWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorWhereUniqueInput>;
export const VendorWhereUniqueInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { VendorUpdateWithoutTechnicalIssueInputObjectSchema as VendorUpdateWithoutTechnicalIssueInputObjectSchema } from './VendorUpdateWithoutTechnicalIssueInput.schema';
import { VendorUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as VendorUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './VendorUncheckedUpdateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => VendorUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const VendorUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.VendorUpdateToOneWithWhereWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateToOneWithWhereWithoutTechnicalIssueInput>;
export const VendorUpdateToOneWithWhereWithoutTechnicalIssueInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorUpdateWithoutTechnicalIssueInputObjectSchema as VendorUpdateWithoutTechnicalIssueInputObjectSchema } from './VendorUpdateWithoutTechnicalIssueInput.schema';
import { VendorUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as VendorUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './VendorUncheckedUpdateWithoutTechnicalIssueInput.schema';
import { VendorCreateWithoutTechnicalIssueInputObjectSchema as VendorCreateWithoutTechnicalIssueInputObjectSchema } from './VendorCreateWithoutTechnicalIssueInput.schema';
import { VendorUncheckedCreateWithoutTechnicalIssueInputObjectSchema as VendorUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './VendorUncheckedCreateWithoutTechnicalIssueInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => VendorUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)]),
  create: z.union([z.lazy(() => VendorCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]),
  where: z.lazy(() => VendorWhereInputObjectSchema).optional()
}).strict();
export const VendorUpsertWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.VendorUpsertWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpsertWithoutTechnicalIssueInput>;
export const VendorUpsertWithoutTechnicalIssueInputObjectZodSchema = makeSchema();

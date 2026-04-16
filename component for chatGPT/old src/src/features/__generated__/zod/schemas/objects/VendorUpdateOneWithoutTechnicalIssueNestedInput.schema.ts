import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutTechnicalIssueInputObjectSchema as VendorCreateWithoutTechnicalIssueInputObjectSchema } from './VendorCreateWithoutTechnicalIssueInput.schema';
import { VendorUncheckedCreateWithoutTechnicalIssueInputObjectSchema as VendorUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './VendorUncheckedCreateWithoutTechnicalIssueInput.schema';
import { VendorCreateOrConnectWithoutTechnicalIssueInputObjectSchema as VendorCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './VendorCreateOrConnectWithoutTechnicalIssueInput.schema';
import { VendorUpsertWithoutTechnicalIssueInputObjectSchema as VendorUpsertWithoutTechnicalIssueInputObjectSchema } from './VendorUpsertWithoutTechnicalIssueInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema as VendorUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema } from './VendorUpdateToOneWithWhereWithoutTechnicalIssueInput.schema';
import { VendorUpdateWithoutTechnicalIssueInputObjectSchema as VendorUpdateWithoutTechnicalIssueInputObjectSchema } from './VendorUpdateWithoutTechnicalIssueInput.schema';
import { VendorUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as VendorUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './VendorUncheckedUpdateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutTechnicalIssueInputObjectSchema).optional(),
  upsert: z.lazy(() => VendorUpsertWithoutTechnicalIssueInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => VendorUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema), z.lazy(() => VendorUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)]).optional()
}).strict();
export const VendorUpdateOneWithoutTechnicalIssueNestedInputObjectSchema: z.ZodType<Prisma.VendorUpdateOneWithoutTechnicalIssueNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateOneWithoutTechnicalIssueNestedInput>;
export const VendorUpdateOneWithoutTechnicalIssueNestedInputObjectZodSchema = makeSchema();

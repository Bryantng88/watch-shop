import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutTechnicalIssueInputObjectSchema as VendorCreateWithoutTechnicalIssueInputObjectSchema } from './VendorCreateWithoutTechnicalIssueInput.schema';
import { VendorUncheckedCreateWithoutTechnicalIssueInputObjectSchema as VendorUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './VendorUncheckedCreateWithoutTechnicalIssueInput.schema';
import { VendorCreateOrConnectWithoutTechnicalIssueInputObjectSchema as VendorCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './VendorCreateOrConnectWithoutTechnicalIssueInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutTechnicalIssueInputObjectSchema).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputObjectSchema).optional()
}).strict();
export const VendorCreateNestedOneWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.VendorCreateNestedOneWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateNestedOneWithoutTechnicalIssueInput>;
export const VendorCreateNestedOneWithoutTechnicalIssueInputObjectZodSchema = makeSchema();

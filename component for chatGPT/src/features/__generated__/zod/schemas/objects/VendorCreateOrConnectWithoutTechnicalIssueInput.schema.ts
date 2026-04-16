import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorCreateWithoutTechnicalIssueInputObjectSchema as VendorCreateWithoutTechnicalIssueInputObjectSchema } from './VendorCreateWithoutTechnicalIssueInput.schema';
import { VendorUncheckedCreateWithoutTechnicalIssueInputObjectSchema as VendorUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './VendorUncheckedCreateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => VendorCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const VendorCreateOrConnectWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.VendorCreateOrConnectWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateOrConnectWithoutTechnicalIssueInput>;
export const VendorCreateOrConnectWithoutTechnicalIssueInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueCreateWithoutVendorInputObjectSchema as TechnicalIssueCreateWithoutVendorInputObjectSchema } from './TechnicalIssueCreateWithoutVendorInput.schema';
import { TechnicalIssueUncheckedCreateWithoutVendorInputObjectSchema as TechnicalIssueUncheckedCreateWithoutVendorInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutVendorInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutVendorInputObjectSchema)])
}).strict();
export const TechnicalIssueCreateOrConnectWithoutVendorInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutVendorInput>;
export const TechnicalIssueCreateOrConnectWithoutVendorInputObjectZodSchema = makeSchema();

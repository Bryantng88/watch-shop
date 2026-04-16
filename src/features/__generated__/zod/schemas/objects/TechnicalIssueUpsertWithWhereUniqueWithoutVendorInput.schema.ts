import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithoutVendorInputObjectSchema as TechnicalIssueUpdateWithoutVendorInputObjectSchema } from './TechnicalIssueUpdateWithoutVendorInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutVendorInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutVendorInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutVendorInput.schema';
import { TechnicalIssueCreateWithoutVendorInputObjectSchema as TechnicalIssueCreateWithoutVendorInputObjectSchema } from './TechnicalIssueCreateWithoutVendorInput.schema';
import { TechnicalIssueUncheckedCreateWithoutVendorInputObjectSchema as TechnicalIssueUncheckedCreateWithoutVendorInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithoutVendorInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutVendorInputObjectSchema)]),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutVendorInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutVendorInputObjectSchema)])
}).strict();
export const TechnicalIssueUpsertWithWhereUniqueWithoutVendorInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpsertWithWhereUniqueWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpsertWithWhereUniqueWithoutVendorInput>;
export const TechnicalIssueUpsertWithWhereUniqueWithoutVendorInputObjectZodSchema = makeSchema();

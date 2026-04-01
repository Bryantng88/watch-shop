import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithoutVendorInputObjectSchema as TechnicalIssueUpdateWithoutVendorInputObjectSchema } from './TechnicalIssueUpdateWithoutVendorInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutVendorInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutVendorInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TechnicalIssueUpdateWithoutVendorInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutVendorInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateWithWhereUniqueWithoutVendorInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateWithWhereUniqueWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateWithWhereUniqueWithoutVendorInput>;
export const TechnicalIssueUpdateWithWhereUniqueWithoutVendorInputObjectZodSchema = makeSchema();

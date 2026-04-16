import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueScalarWhereInputObjectSchema as TechnicalIssueScalarWhereInputObjectSchema } from './TechnicalIssueScalarWhereInput.schema';
import { TechnicalIssueUpdateManyMutationInputObjectSchema as TechnicalIssueUpdateManyMutationInputObjectSchema } from './TechnicalIssueUpdateManyMutationInput.schema';
import { TechnicalIssueUncheckedUpdateManyWithoutVendorInputObjectSchema as TechnicalIssueUncheckedUpdateManyWithoutVendorInputObjectSchema } from './TechnicalIssueUncheckedUpdateManyWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TechnicalIssueUpdateManyMutationInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutVendorInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateManyWithWhereWithoutVendorInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyWithWhereWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateManyWithWhereWithoutVendorInput>;
export const TechnicalIssueUpdateManyWithWhereWithoutVendorInputObjectZodSchema = makeSchema();

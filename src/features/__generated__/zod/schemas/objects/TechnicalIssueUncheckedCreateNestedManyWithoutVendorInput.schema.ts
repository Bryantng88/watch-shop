import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutVendorInputObjectSchema as TechnicalIssueCreateWithoutVendorInputObjectSchema } from './TechnicalIssueCreateWithoutVendorInput.schema';
import { TechnicalIssueUncheckedCreateWithoutVendorInputObjectSchema as TechnicalIssueUncheckedCreateWithoutVendorInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutVendorInput.schema';
import { TechnicalIssueCreateOrConnectWithoutVendorInputObjectSchema as TechnicalIssueCreateOrConnectWithoutVendorInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutVendorInput.schema';
import { TechnicalIssueCreateManyVendorInputEnvelopeObjectSchema as TechnicalIssueCreateManyVendorInputEnvelopeObjectSchema } from './TechnicalIssueCreateManyVendorInputEnvelope.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutVendorInputObjectSchema), z.lazy(() => TechnicalIssueCreateWithoutVendorInputObjectSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutVendorInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutVendorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TechnicalIssueCreateOrConnectWithoutVendorInputObjectSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutVendorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyVendorInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TechnicalIssueUncheckedCreateNestedManyWithoutVendorInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUncheckedCreateNestedManyWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUncheckedCreateNestedManyWithoutVendorInput>;
export const TechnicalIssueUncheckedCreateNestedManyWithoutVendorInputObjectZodSchema = makeSchema();

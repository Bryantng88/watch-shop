import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutServiceRequestInputObjectSchema as TechnicalIssueCreateWithoutServiceRequestInputObjectSchema } from './TechnicalIssueCreateWithoutServiceRequestInput.schema';
import { TechnicalIssueUncheckedCreateWithoutServiceRequestInputObjectSchema as TechnicalIssueUncheckedCreateWithoutServiceRequestInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutServiceRequestInput.schema';
import { TechnicalIssueCreateOrConnectWithoutServiceRequestInputObjectSchema as TechnicalIssueCreateOrConnectWithoutServiceRequestInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutServiceRequestInput.schema';
import { TechnicalIssueCreateManyServiceRequestInputEnvelopeObjectSchema as TechnicalIssueCreateManyServiceRequestInputEnvelopeObjectSchema } from './TechnicalIssueCreateManyServiceRequestInputEnvelope.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalIssueCreateWithoutServiceRequestInputObjectSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutServiceRequestInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TechnicalIssueCreateOrConnectWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutServiceRequestInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyServiceRequestInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TechnicalIssueCreateNestedManyWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateNestedManyWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateNestedManyWithoutServiceRequestInput>;
export const TechnicalIssueCreateNestedManyWithoutServiceRequestInputObjectZodSchema = makeSchema();

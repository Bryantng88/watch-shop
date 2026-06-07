import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutPaymentsInputObjectSchema as TechnicalIssueCreateWithoutPaymentsInputObjectSchema } from './TechnicalIssueCreateWithoutPaymentsInput.schema';
import { TechnicalIssueUncheckedCreateWithoutPaymentsInputObjectSchema as TechnicalIssueUncheckedCreateWithoutPaymentsInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutPaymentsInput.schema';
import { TechnicalIssueCreateOrConnectWithoutPaymentsInputObjectSchema as TechnicalIssueCreateOrConnectWithoutPaymentsInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutPaymentsInput.schema';
import { TechnicalIssueUpsertWithoutPaymentsInputObjectSchema as TechnicalIssueUpsertWithoutPaymentsInputObjectSchema } from './TechnicalIssueUpsertWithoutPaymentsInput.schema';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './TechnicalIssueWhereInput.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateToOneWithWhereWithoutPaymentsInputObjectSchema as TechnicalIssueUpdateToOneWithWhereWithoutPaymentsInputObjectSchema } from './TechnicalIssueUpdateToOneWithWhereWithoutPaymentsInput.schema';
import { TechnicalIssueUpdateWithoutPaymentsInputObjectSchema as TechnicalIssueUpdateWithoutPaymentsInputObjectSchema } from './TechnicalIssueUpdateWithoutPaymentsInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutPaymentsInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutPaymentsInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutPaymentsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutPaymentsInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutPaymentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TechnicalIssueCreateOrConnectWithoutPaymentsInputObjectSchema).optional(),
  upsert: z.lazy(() => TechnicalIssueUpsertWithoutPaymentsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => TechnicalIssueWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => TechnicalIssueWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TechnicalIssueUpdateToOneWithWhereWithoutPaymentsInputObjectSchema), z.lazy(() => TechnicalIssueUpdateWithoutPaymentsInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutPaymentsInputObjectSchema)]).optional()
}).strict();
export const TechnicalIssueUpdateOneWithoutPaymentsNestedInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateOneWithoutPaymentsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateOneWithoutPaymentsNestedInput>;
export const TechnicalIssueUpdateOneWithoutPaymentsNestedInputObjectZodSchema = makeSchema();

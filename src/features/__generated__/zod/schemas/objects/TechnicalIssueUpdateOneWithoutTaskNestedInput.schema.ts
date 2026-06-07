import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutTaskInputObjectSchema as TechnicalIssueCreateWithoutTaskInputObjectSchema } from './TechnicalIssueCreateWithoutTaskInput.schema';
import { TechnicalIssueUncheckedCreateWithoutTaskInputObjectSchema as TechnicalIssueUncheckedCreateWithoutTaskInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutTaskInput.schema';
import { TechnicalIssueCreateOrConnectWithoutTaskInputObjectSchema as TechnicalIssueCreateOrConnectWithoutTaskInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutTaskInput.schema';
import { TechnicalIssueUpsertWithoutTaskInputObjectSchema as TechnicalIssueUpsertWithoutTaskInputObjectSchema } from './TechnicalIssueUpsertWithoutTaskInput.schema';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './TechnicalIssueWhereInput.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateToOneWithWhereWithoutTaskInputObjectSchema as TechnicalIssueUpdateToOneWithWhereWithoutTaskInputObjectSchema } from './TechnicalIssueUpdateToOneWithWhereWithoutTaskInput.schema';
import { TechnicalIssueUpdateWithoutTaskInputObjectSchema as TechnicalIssueUpdateWithoutTaskInputObjectSchema } from './TechnicalIssueUpdateWithoutTaskInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutTaskInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutTaskInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutTaskInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTaskInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TechnicalIssueCreateOrConnectWithoutTaskInputObjectSchema).optional(),
  upsert: z.lazy(() => TechnicalIssueUpsertWithoutTaskInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => TechnicalIssueWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => TechnicalIssueWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TechnicalIssueUpdateToOneWithWhereWithoutTaskInputObjectSchema), z.lazy(() => TechnicalIssueUpdateWithoutTaskInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutTaskInputObjectSchema)]).optional()
}).strict();
export const TechnicalIssueUpdateOneWithoutTaskNestedInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateOneWithoutTaskNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateOneWithoutTaskNestedInput>;
export const TechnicalIssueUpdateOneWithoutTaskNestedInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SupplyCatalogCreateWithoutTechnicalIssueInputObjectSchema as SupplyCatalogCreateWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogCreateWithoutTechnicalIssueInput.schema';
import { SupplyCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema as SupplyCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogUncheckedCreateWithoutTechnicalIssueInput.schema';
import { SupplyCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema as SupplyCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogCreateOrConnectWithoutTechnicalIssueInput.schema';
import { SupplyCatalogUpsertWithoutTechnicalIssueInputObjectSchema as SupplyCatalogUpsertWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogUpsertWithoutTechnicalIssueInput.schema';
import { SupplyCatalogWhereInputObjectSchema as SupplyCatalogWhereInputObjectSchema } from './SupplyCatalogWhereInput.schema';
import { SupplyCatalogWhereUniqueInputObjectSchema as SupplyCatalogWhereUniqueInputObjectSchema } from './SupplyCatalogWhereUniqueInput.schema';
import { SupplyCatalogUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema as SupplyCatalogUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogUpdateToOneWithWhereWithoutTechnicalIssueInput.schema';
import { SupplyCatalogUpdateWithoutTechnicalIssueInputObjectSchema as SupplyCatalogUpdateWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogUpdateWithoutTechnicalIssueInput.schema';
import { SupplyCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as SupplyCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogUncheckedUpdateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SupplyCatalogCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => SupplyCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => SupplyCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema).optional(),
  upsert: z.lazy(() => SupplyCatalogUpsertWithoutTechnicalIssueInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => SupplyCatalogWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => SupplyCatalogWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => SupplyCatalogWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => SupplyCatalogUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema), z.lazy(() => SupplyCatalogUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => SupplyCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)]).optional()
}).strict();
export const SupplyCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectSchema: z.ZodType<Prisma.SupplyCatalogUpdateOneWithoutTechnicalIssueNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogUpdateOneWithoutTechnicalIssueNestedInput>;
export const SupplyCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectZodSchema = makeSchema();

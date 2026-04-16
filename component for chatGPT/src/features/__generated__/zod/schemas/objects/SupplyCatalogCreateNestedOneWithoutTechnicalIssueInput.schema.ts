import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SupplyCatalogCreateWithoutTechnicalIssueInputObjectSchema as SupplyCatalogCreateWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogCreateWithoutTechnicalIssueInput.schema';
import { SupplyCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema as SupplyCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogUncheckedCreateWithoutTechnicalIssueInput.schema';
import { SupplyCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema as SupplyCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogCreateOrConnectWithoutTechnicalIssueInput.schema';
import { SupplyCatalogWhereUniqueInputObjectSchema as SupplyCatalogWhereUniqueInputObjectSchema } from './SupplyCatalogWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SupplyCatalogCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => SupplyCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => SupplyCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema).optional(),
  connect: z.lazy(() => SupplyCatalogWhereUniqueInputObjectSchema).optional()
}).strict();
export const SupplyCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.SupplyCatalogCreateNestedOneWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogCreateNestedOneWithoutTechnicalIssueInput>;
export const SupplyCatalogCreateNestedOneWithoutTechnicalIssueInputObjectZodSchema = makeSchema();

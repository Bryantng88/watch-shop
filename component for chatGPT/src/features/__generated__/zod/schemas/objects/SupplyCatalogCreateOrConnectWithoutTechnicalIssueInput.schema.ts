import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SupplyCatalogWhereUniqueInputObjectSchema as SupplyCatalogWhereUniqueInputObjectSchema } from './SupplyCatalogWhereUniqueInput.schema';
import { SupplyCatalogCreateWithoutTechnicalIssueInputObjectSchema as SupplyCatalogCreateWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogCreateWithoutTechnicalIssueInput.schema';
import { SupplyCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema as SupplyCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogUncheckedCreateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SupplyCatalogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => SupplyCatalogCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => SupplyCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const SupplyCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.SupplyCatalogCreateOrConnectWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogCreateOrConnectWithoutTechnicalIssueInput>;
export const SupplyCatalogCreateOrConnectWithoutTechnicalIssueInputObjectZodSchema = makeSchema();

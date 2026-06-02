import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalDetailCatalogCreateWithoutTechnicalIssuesInputObjectSchema as TechnicalDetailCatalogCreateWithoutTechnicalIssuesInputObjectSchema } from './TechnicalDetailCatalogCreateWithoutTechnicalIssuesInput.schema';
import { TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInputObjectSchema as TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInputObjectSchema } from './TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInput.schema';
import { TechnicalDetailCatalogCreateOrConnectWithoutTechnicalIssuesInputObjectSchema as TechnicalDetailCatalogCreateOrConnectWithoutTechnicalIssuesInputObjectSchema } from './TechnicalDetailCatalogCreateOrConnectWithoutTechnicalIssuesInput.schema';
import { TechnicalDetailCatalogUpsertWithoutTechnicalIssuesInputObjectSchema as TechnicalDetailCatalogUpsertWithoutTechnicalIssuesInputObjectSchema } from './TechnicalDetailCatalogUpsertWithoutTechnicalIssuesInput.schema';
import { TechnicalDetailCatalogWhereInputObjectSchema as TechnicalDetailCatalogWhereInputObjectSchema } from './TechnicalDetailCatalogWhereInput.schema';
import { TechnicalDetailCatalogWhereUniqueInputObjectSchema as TechnicalDetailCatalogWhereUniqueInputObjectSchema } from './TechnicalDetailCatalogWhereUniqueInput.schema';
import { TechnicalDetailCatalogUpdateToOneWithWhereWithoutTechnicalIssuesInputObjectSchema as TechnicalDetailCatalogUpdateToOneWithWhereWithoutTechnicalIssuesInputObjectSchema } from './TechnicalDetailCatalogUpdateToOneWithWhereWithoutTechnicalIssuesInput.schema';
import { TechnicalDetailCatalogUpdateWithoutTechnicalIssuesInputObjectSchema as TechnicalDetailCatalogUpdateWithoutTechnicalIssuesInputObjectSchema } from './TechnicalDetailCatalogUpdateWithoutTechnicalIssuesInput.schema';
import { TechnicalDetailCatalogUncheckedUpdateWithoutTechnicalIssuesInputObjectSchema as TechnicalDetailCatalogUncheckedUpdateWithoutTechnicalIssuesInputObjectSchema } from './TechnicalDetailCatalogUncheckedUpdateWithoutTechnicalIssuesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalDetailCatalogCreateWithoutTechnicalIssuesInputObjectSchema), z.lazy(() => TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TechnicalDetailCatalogCreateOrConnectWithoutTechnicalIssuesInputObjectSchema).optional(),
  upsert: z.lazy(() => TechnicalDetailCatalogUpsertWithoutTechnicalIssuesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => TechnicalDetailCatalogWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => TechnicalDetailCatalogWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => TechnicalDetailCatalogWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TechnicalDetailCatalogUpdateToOneWithWhereWithoutTechnicalIssuesInputObjectSchema), z.lazy(() => TechnicalDetailCatalogUpdateWithoutTechnicalIssuesInputObjectSchema), z.lazy(() => TechnicalDetailCatalogUncheckedUpdateWithoutTechnicalIssuesInputObjectSchema)]).optional()
}).strict();
export const TechnicalDetailCatalogUpdateOneWithoutTechnicalIssuesNestedInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogUpdateOneWithoutTechnicalIssuesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogUpdateOneWithoutTechnicalIssuesNestedInput>;
export const TechnicalDetailCatalogUpdateOneWithoutTechnicalIssuesNestedInputObjectZodSchema = makeSchema();

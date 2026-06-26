import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagLinkScalarWhereInputObjectSchema as AppTagLinkScalarWhereInputObjectSchema } from './AppTagLinkScalarWhereInput.schema';
import { AppTagLinkUpdateManyMutationInputObjectSchema as AppTagLinkUpdateManyMutationInputObjectSchema } from './AppTagLinkUpdateManyMutationInput.schema';
import { AppTagLinkUncheckedUpdateManyWithoutTagInputObjectSchema as AppTagLinkUncheckedUpdateManyWithoutTagInputObjectSchema } from './AppTagLinkUncheckedUpdateManyWithoutTagInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AppTagLinkScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AppTagLinkUpdateManyMutationInputObjectSchema), z.lazy(() => AppTagLinkUncheckedUpdateManyWithoutTagInputObjectSchema)])
}).strict();
export const AppTagLinkUpdateManyWithWhereWithoutTagInputObjectSchema: z.ZodType<Prisma.AppTagLinkUpdateManyWithWhereWithoutTagInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkUpdateManyWithWhereWithoutTagInput>;
export const AppTagLinkUpdateManyWithWhereWithoutTagInputObjectZodSchema = makeSchema();

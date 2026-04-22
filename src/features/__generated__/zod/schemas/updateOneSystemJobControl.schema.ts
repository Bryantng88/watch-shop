import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobControlSelectObjectSchema as SystemJobControlSelectObjectSchema } from './objects/SystemJobControlSelect.schema';
import { SystemJobControlUpdateInputObjectSchema as SystemJobControlUpdateInputObjectSchema } from './objects/SystemJobControlUpdateInput.schema';
import { SystemJobControlUncheckedUpdateInputObjectSchema as SystemJobControlUncheckedUpdateInputObjectSchema } from './objects/SystemJobControlUncheckedUpdateInput.schema';
import { SystemJobControlWhereUniqueInputObjectSchema as SystemJobControlWhereUniqueInputObjectSchema } from './objects/SystemJobControlWhereUniqueInput.schema';

export const SystemJobControlUpdateOneSchema: z.ZodType<Prisma.SystemJobControlUpdateArgs> = z.object({ select: SystemJobControlSelectObjectSchema.optional(),  data: z.union([SystemJobControlUpdateInputObjectSchema, SystemJobControlUncheckedUpdateInputObjectSchema]), where: SystemJobControlWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SystemJobControlUpdateArgs>;

export const SystemJobControlUpdateOneZodSchema = z.object({ select: SystemJobControlSelectObjectSchema.optional(),  data: z.union([SystemJobControlUpdateInputObjectSchema, SystemJobControlUncheckedUpdateInputObjectSchema]), where: SystemJobControlWhereUniqueInputObjectSchema }).strict();
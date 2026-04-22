import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobControlSelectObjectSchema as SystemJobControlSelectObjectSchema } from './objects/SystemJobControlSelect.schema';
import { SystemJobControlWhereUniqueInputObjectSchema as SystemJobControlWhereUniqueInputObjectSchema } from './objects/SystemJobControlWhereUniqueInput.schema';

export const SystemJobControlDeleteOneSchema: z.ZodType<Prisma.SystemJobControlDeleteArgs> = z.object({ select: SystemJobControlSelectObjectSchema.optional(),  where: SystemJobControlWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SystemJobControlDeleteArgs>;

export const SystemJobControlDeleteOneZodSchema = z.object({ select: SystemJobControlSelectObjectSchema.optional(),  where: SystemJobControlWhereUniqueInputObjectSchema }).strict();
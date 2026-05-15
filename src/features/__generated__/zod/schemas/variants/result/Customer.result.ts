import * as z from 'zod';

// prettier-ignore
export const CustomerResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    ward: z.string().nullable(),
    city: z.string().nullable(),
    userId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    address: z.string().nullable(),
    district: z.string().nullable(),
    acquisition: z.array(z.unknown()),
    user: z.unknown().nullable(),
    Invoice: z.array(z.unknown()),
    order: z.array(z.unknown()),
    serviceRequest: z.array(z.unknown())
}).strict();

export type CustomerResultType = z.infer<typeof CustomerResultSchema>;

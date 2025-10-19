import * as z from 'zod';

// prettier-ignore
export const CustomerModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    ward: z.string().nullable(),
    city: z.string().nullable(),
    userId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    Acquisition: z.array(z.unknown()),
    user: z.unknown().nullable(),
    Invoice: z.array(z.unknown()),
    orders: z.array(z.unknown()),
    ServiceRequest: z.array(z.unknown())
}).strict();

export type CustomerPureType = z.infer<typeof CustomerModelSchema>;

import { PrismaClient } from '@prisma/client';

declare module '@prisma/client' {
    interface PrismaClient {
        $use(callback: (params: any, next: (params: any) => Promise<any>) => Promise<any>): void;
    }
}

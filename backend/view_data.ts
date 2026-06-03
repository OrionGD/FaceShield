import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PrismaService } from './src/prisma/prisma.service';

async function bootstrap() {
    console.log('--- Bootstrapping NestJS context ---');
    const app = await NestFactory.createApplicationContext(AppModule);
    const prisma = app.get(PrismaService);

    console.log('--- Fetching Database Records ---');

    // 1. Fetch Users
    const users = await prisma.user.findMany({
        take: 5, // Limit to 5 records for readability
    });
    console.log('\n--- USERS ---');
    console.dir(users, { depth: null, colors: true });

    // 2. Fetch Attendance Records
    const attendance = await prisma.attendance.findMany({
        take: 5,
        orderBy: { checkIn: 'desc' }
    });
    console.log('\n--- RECENT ATTENDANCE ---');
    console.dir(attendance, { depth: null, colors: true });

    // 3. Fetch Incidents
    const incidents = await prisma.incident.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    });
    console.log('\n--- RECENT INCIDENTS ---');
    console.dir(incidents, { depth: null, colors: true });

    await app.close();
}

bootstrap().catch(err => {
    console.error('Error fetching data:', err);
});
 
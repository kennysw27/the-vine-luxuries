import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

async function main() {
  try {
    const libsql = createClient({ url: 'file:./dev.db' });
    const adapter = new PrismaLibSql(libsql);
    const prisma = new PrismaClient({ adapter });

    const logs = await prisma.visitorLog.findMany();
    console.log("Success! Logs:", logs.length);
  } catch (e) {
    console.error("Error:", e);
  }
}

main();

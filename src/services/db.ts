import {PrismaClient} from '@/generated/prisma'

const db = new PrismaClient()

async function dbConnect() {
    try {
        await db.$connect()
        console.log('===> Connected to database')
    } catch (_) {
        console.error("====> Error connecting to database")
        process.exit(1)
    }
}

export {dbConnect, db}


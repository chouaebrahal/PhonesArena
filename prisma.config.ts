// prisma.config.ts
import path from 'node:path'
import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'

// load .env file manually
dotenv.config()

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
    seed: 'tsx --env-file=.env prisma/seed.ts',
  },
})



const path = require('path')
const dotenv = require('dotenv')
const { migrate } = require('postgres-migrations')

dotenv.config()

async function migrations () {
  const dbConfig = {
    database: process.env.POSTGRESQL_DATABASE,
    user: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    host: process.env.POSTGRESQL_HOST,
    port: Number(process.env.POSTGRESQL_PORT),
  }

  await migrate(dbConfig, path.join(__dirname, '/migrations'))
}

migrations().then(res => console.log('Successfully migrated')).catch(err => console.log(err))

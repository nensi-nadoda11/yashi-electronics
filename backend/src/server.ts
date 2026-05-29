import { app } from './app'
import { env } from './config/env'

const server = app.listen(env.port, () => {
  process.stdout.write(`Yashi Electronics API running on port ${env.port}\n`)
})

server.on('error', (error) => {
  process.stderr.write(`Failed to start server: ${error.message}\n`)
  process.exit(1)
})

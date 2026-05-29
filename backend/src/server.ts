import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

dotenv.config()

const app = express()
const port = Number(process.env.PORT ?? 4000)

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

const healthResponse = {
  success: true,
  message: 'Yashi Electronics API running',
}

app.get('/', (_request, response) => {
  response.status(200).json(healthResponse)
})

app.get('/health', (_request, response) => {
  response.status(200).json(healthResponse)
})

app.listen(port, () => {
  process.stdout.write(`Yashi Electronics API running on port ${port}\n`)
})

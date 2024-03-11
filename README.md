# Guía de uso

## Instalación

Para instalar el paquete, hacer un clone del repositorio y ejecutar el siguiente comando:

```bash
git clone url del repositorio
```

Acceder a la carpeta del client y server y ejecutar el siguiente comando:

```bash
npm install
```

para instalar las dependencias.

## Uso

Para el cliente, esta con VIT ejecutar el siguiente comando:

```bash
npm run dev
```

Para el servidor, esta con NODEJS ejecutar el siguiente comando:

```bash
npm run dev
```

## Para base de datos se utiliza PostgreSQL y Prisma ORM

### Para el uso de la base de datos, envió de email, aws s3, Unsplash crear el archivo .env y usar sus propios respectivas credenciales en el archivo .env - server

./server/.env

```bash
  DATABASE_URL=""
  SMTP_HOST=""
  SMTP_PORT=
  SMTP_SECURE=
  SMTP_USER=""
  SMTP_PASSWORD=""

  JWT_SECRET_KEY=
  UPDATE_JWT_SECRET_KEY=

  AWS_ACCESS_KEY_ID=
  AWS_SECRET_ACCESS_KEY=
  AWS_REGION=
  AWS_BUCKET_NAME=

  UNSPLASH_APPLICATION_ID=
  UNSPLASH_ACCESS_KEY=
  UNSPLASH_SECRET_KEY=
```

Este utiliza ZOD para la validación de las variables de entorno.
./server/src/config/env.ts

```bash
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_SECURE: z.coerce.boolean(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),

  JWT_SECRET_KEY: z.string(),
  UPDATE_JWT_SECRET_KEY: z.string(),

  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_BUCKET_NAME: z.string(),

  UNSPLASH_APPLICATION_ID: z.string(),
  UNSPLASH_ACCESS_KEY: z.string(),
  UNSPLASH_SECRET_KEY: z.string(),
```

## Los endpoints de la API son los siguientes:

./server/src/routes/index.ts

Este utiliza tRPC para los API

```bash
# User
./src/routes/user.ts
http://localhost:3000/trpc/user.create
http://localhost:3000/trpc/user.login
http://localhost:3000/trpc/user.logout
http://localhost:3000/trpc/user.lostPassword

# AWS S3
./src/routes/file.ts
http://localhost:3000/trpc/file.uploadFile
http://localhost:3000/trpc/file.uploadFileFromUnsplash
http://localhost:3000/trpc/file.readFiles
http://localhost:3000/trpc/file.updateFileName
http://localhost:3000/trpc/file.deleteFile

# Unsplash API
./src/routes/unsplash.ts
http://localhost:3000/trpc/unsplash.search
```

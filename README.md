![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/gareth-houghton/sample-todo?utm_source=oss&utm_medium=github&utm_campaign=gareth-houghton%2Fsample-todo&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

This is a simple todo demo application which can be used to test out and investigate various different tools and technologies.

## Getting Started

To start, you'll need to spin up the backend using docker compose from the `/infra` directory:

```bash
docker compose up -d
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

:tada: That's it, you're up and running

## Finished work

When you're done running locally all you need to do is turn off the database:

```bash
docker compose down
```

As the docker compose file uses a volume this will persist any data that you created as part of your work. If you wish to remove that volume you can do:

```bash
docker compose down -v
```

## Database
The app uses Drizzle as an ORM to connect to a PostgreSQL database. One of the benefits is that the source repository contains the database migrations, making DB creation really easy. 

If a change is made to the database schema and you need to generate new migrations this can be done really easily using the `drizzle-kit` command below:

```bash
npx drizzle-kit generate
```

This will create the migration file in `/drizzle` which you can run however you like.
import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import {VideoResolver} from "./resolvers/VideoResolver"
import { AppDataSource } from "./utils/data-source";
import { createHandler } from 'graphql-http/lib/use/express';
import path from 'path';
import fs from 'fs';

const AWS = require('aws-sdk');

// Set the region and access keys
AWS.config.update({
  region: 'default',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Create a new instance of the S3 class
export const s3 = new AWS.S3();

async function bootstrap() {
  // Initialize TypeORM
  await AppDataSource.initialize();

  // Build the GraphQL schema
  const schema = await buildSchema({
    resolvers: [VideoResolver],
  });

  // Create an Express application
  const app = express();

  // Create the GraphQL HTTP handler
  app.use('/graphql', createHandler({ schema }));

  // Serve GraphiQL
  app.get('/graphiql', (req, res) => {
    const graphiqlHTML = fs.readFileSync(path.resolve(__dirname, 'graphiql.html'), 'utf8');
    res.send(graphiqlHTML);
  });

  // Start the server
  app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000/graphql");
    console.log("GraphiQL is available at http://localhost:4000/graphiql");
  });
}

bootstrap();
// npx ts-node src/index.ts

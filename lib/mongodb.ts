import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  // DO NOT ship logs with full secrets—only length/head.
  console.error('ENV MONGODB_URI missing');
  throw new Error('Missing MONGODB_URI in environment');
}

let cached = (global as any).mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
if (!cached) cached = (global as any).mongoose = { conn: null, promise: null };

export async function connectToDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    console.log('Connecting to MongoDB… (uri len:', MONGODB_URI.length, ')');
    cached.promise = mongoose.connect(MONGODB_URI, { dbName: 'notes_app' })
      .catch((e) => {
        // surface root cause clearly
        console.error('Mongo connect error name:', e?.name);
        console.error('Mongo connect error message:', e?.message);
        throw e;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

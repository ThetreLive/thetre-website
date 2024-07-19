import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

redis.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

export default redis;

import 'tsconfig-paths/register';
import mongoose from 'mongoose';
import { app } from '@/app';
import { config } from '@/config/dev';
import { logger } from '@/config/logger';
// connect to the database and start the server
mongoose
  .connect(`${config.dBUrl}`)
  .then(() => {
    console.log('🚀 Database Connection Established 🚀');
    app.listen(`${config.port}`, () => {
      console.log(`️🖥 Server running on port ${config.port} 🖥`);
    });
  })
  .catch(err => {
    logger.error('🚨 Error connecting to db: ' + err.message);
  });

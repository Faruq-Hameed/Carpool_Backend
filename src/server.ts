import 'tsconfig-paths/register';
import mongoose from 'mongoose';
import { app } from '@/app';
const port = process.env.port ?? 5000;
// connect to the database and start the server
mongoose
  .connect(process.env.LOCAL_MONGODB_URI ?? '')
  .then(() => {
    console.log('🚀 Database Connection Established 🚀');
    app.listen(port, () => {
      console.log(`🖥 Server running on port ${port} 🖥`);
    });
  })
  .catch(err => {
    console.log('🚨 Error connecting to db: ' + err.message);
  });

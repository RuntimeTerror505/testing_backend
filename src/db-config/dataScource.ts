import { resolve } from 'path';
import { DataSource } from 'typeorm';
import { typeormConfig } from './typeorm.config';

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'test_app',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/**/*{.js,.ts}'],
});

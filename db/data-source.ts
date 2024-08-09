import { DataSourceOptions, DataSource } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: "mysql",
    host: 'mysql', 
    port: 3306,
    username: "root",
    password: "1234",
    database: "viblo_blog_db",
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDb1723172532620 implements MigrationInterface {
    name = 'CreateDb1723172532620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`description\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`meta_title\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`status\` enum ('active', 'inactive', 'suspended', 'pending', 'deleted') NOT NULL DEFAULT 'active', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`role\` enum ('admin', 'user', 'guest') NOT NULL DEFAULT 'user', \`first_name\` varchar(255) NOT NULL, \`middle_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`phone_number\` varchar(255) NOT NULL, \`intro\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`refresh_token\` varchar(255) NULL, \`status\` enum ('active', 'inactive', 'suspended', 'pending', 'deleted') NOT NULL DEFAULT 'active', \`avatar\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`last_login\` timestamp NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('active', 'deleted') NOT NULL DEFAULT 'active', \`content\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`publish_at\` timestamp NULL, \`userId\` int NULL, \`postId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`posts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`thumbnail\` varchar(255) NOT NULL, \`status\` enum ('active', 'inactive', 'suspended', 'pending', 'deleted') NOT NULL DEFAULT 'active', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`publish_at\` timestamp NULL, \`slug\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`meta_title\` varchar(255) NOT NULL, \`summary\` varchar(255) NOT NULL, \`is_featured\` tinyint NOT NULL DEFAULT 0, \`image_gallery\` text NULL, \`views\` int NOT NULL DEFAULT '0', \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category_posts\` (\`category_id\` int NOT NULL, \`post_id\` int NOT NULL, INDEX \`IDX_c58dbd4db3b9b8095e0f73fdef\` (\`category_id\`), INDEX \`IDX_4ac144f2d95d0b385b0742836a\` (\`post_id\`), PRIMARY KEY (\`category_id\`, \`post_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_7e8d7c49f218ebb14314fdb3749\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_e44ddaaa6d058cb4092f83ad61f\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_posts\` ADD CONSTRAINT \`FK_c58dbd4db3b9b8095e0f73fdef8\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`category_posts\` ADD CONSTRAINT \`FK_4ac144f2d95d0b385b0742836ac\` FOREIGN KEY (\`post_id\`) REFERENCES \`posts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category_posts\` DROP FOREIGN KEY \`FK_4ac144f2d95d0b385b0742836ac\``);
        await queryRunner.query(`ALTER TABLE \`category_posts\` DROP FOREIGN KEY \`FK_c58dbd4db3b9b8095e0f73fdef8\``);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_e44ddaaa6d058cb4092f83ad61f\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_7e8d7c49f218ebb14314fdb3749\``);
        await queryRunner.query(`DROP INDEX \`IDX_4ac144f2d95d0b385b0742836a\` ON \`category_posts\``);
        await queryRunner.query(`DROP INDEX \`IDX_c58dbd4db3b9b8095e0f73fdef\` ON \`category_posts\``);
        await queryRunner.query(`DROP TABLE \`category_posts\``);
        await queryRunner.query(`DROP TABLE \`posts\``);
        await queryRunner.query(`DROP TABLE \`comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
    }

}

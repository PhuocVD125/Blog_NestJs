import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePostCategory1722484720815 implements MigrationInterface {
    name = 'UpdatePostCategory1722484720815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_168bf21b341e2ae340748e2541d\``);
        await queryRunner.query(`CREATE TABLE \`category_posts\` (\`category_id\` int NOT NULL, \`post_id\` int NOT NULL, INDEX \`IDX_c58dbd4db3b9b8095e0f73fdef\` (\`category_id\`), INDEX \`IDX_4ac144f2d95d0b385b0742836a\` (\`post_id\`), PRIMARY KEY (\`category_id\`, \`post_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`categoryId\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`intro\` \`intro\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`avatar\` \`avatar\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`last_login\` \`last_login\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\``);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`publish_at\` \`publish_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`image_gallery\` \`image_gallery\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_posts\` ADD CONSTRAINT \`FK_c58dbd4db3b9b8095e0f73fdef8\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`category_posts\` ADD CONSTRAINT \`FK_4ac144f2d95d0b385b0742836ac\` FOREIGN KEY (\`post_id\`) REFERENCES \`posts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category_posts\` DROP FOREIGN KEY \`FK_4ac144f2d95d0b385b0742836ac\``);
        await queryRunner.query(`ALTER TABLE \`category_posts\` DROP FOREIGN KEY \`FK_c58dbd4db3b9b8095e0f73fdef8\``);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\``);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`image_gallery\` \`image_gallery\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`publish_at\` \`publish_at\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`last_login\` \`last_login\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`avatar\` \`avatar\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`intro\` \`intro\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD \`categoryId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP INDEX \`IDX_4ac144f2d95d0b385b0742836a\` ON \`category_posts\``);
        await queryRunner.query(`DROP INDEX \`IDX_c58dbd4db3b9b8095e0f73fdef\` ON \`category_posts\``);
        await queryRunner.query(`DROP TABLE \`category_posts\``);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_168bf21b341e2ae340748e2541d\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

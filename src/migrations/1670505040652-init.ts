import { MigrationInterface, QueryRunner } from "typeorm";

export class init1670505040652 implements MigrationInterface {
    name = 'init1670505040652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`donations\` (\`id\` varchar(255) NOT NULL, \`amount\` int NOT NULL, \`donatorNickname\` varchar(255) NOT NULL, \`state\` enum ('valid', 'invalid') NOT NULL, \`selectedCrypto\` enum ('ETH', 'BTC') NULL, \`cryptoAmount\` int NULL, \`campaignId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`owners\` (\`userId\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`walletAddress\` varchar(255) NOT NULL, \`isFraud\` tinyint NOT NULL, PRIMARY KEY (\`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`campaigns\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`goal\` float NOT NULL, \`expires_at\` date NOT NULL, \`status\` enum ('active', 'successful', 'expired', 'fraud') NOT NULL, \`currency\` varchar(255) NOT NULL, \`ownerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`donations\` ADD CONSTRAINT \`FK_dce45a84508ba5fd75e35d6f2a4\` FOREIGN KEY (\`campaignId\`) REFERENCES \`campaigns\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`campaigns\` ADD CONSTRAINT \`FK_90d64375279aec38e309f12ff78\` FOREIGN KEY (\`ownerId\`) REFERENCES \`owners\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`campaigns\` DROP FOREIGN KEY \`FK_90d64375279aec38e309f12ff78\``);
        await queryRunner.query(`ALTER TABLE \`donations\` DROP FOREIGN KEY \`FK_dce45a84508ba5fd75e35d6f2a4\``);
        await queryRunner.query(`DROP TABLE \`campaigns\``);
        await queryRunner.query(`DROP TABLE \`owners\``);
        await queryRunner.query(`DROP TABLE \`donations\``);
    }

}

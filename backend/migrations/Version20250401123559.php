<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250401123559 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_blocks (user_id INT NOT NULL, blockedUser_id INT NOT NULL, INDEX IDX_ABBF8E45A76ED395 (user_id), INDEX IDX_ABBF8E45255CF2FC (blockedUser_id), PRIMARY KEY(user_id, blockedUser_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_blocks ADD CONSTRAINT FK_ABBF8E45A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_blocks ADD CONSTRAINT FK_ABBF8E45255CF2FC FOREIGN KEY (blockedUser_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_blocks DROP FOREIGN KEY FK_ABBF8E45A76ED395');
        $this->addSql('ALTER TABLE user_blocks DROP FOREIGN KEY FK_ABBF8E45255CF2FC');
        $this->addSql('DROP TABLE user_blocks');
    }
}

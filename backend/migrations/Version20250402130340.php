<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250402130340 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE reply (id INT AUTO_INCREMENT NOT NULL, author_id INT NOT NULL, text VARCHAR(280) NOT NULL, time DATETIME NOT NULL, belongs_to_user TINYINT(1) DEFAULT NULL, user_blocked_by_author TINYINT(1) DEFAULT NULL, INDEX IDX_FDA8C6E0F675F31B (author_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reply_likes (reply_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_862075718A0E4E7F (reply_id), INDEX IDX_86207571A76ED395 (user_id), PRIMARY KEY(reply_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE reply ADD CONSTRAINT FK_FDA8C6E0F675F31B FOREIGN KEY (author_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE reply_likes ADD CONSTRAINT FK_862075718A0E4E7F FOREIGN KEY (reply_id) REFERENCES reply (id)');
        $this->addSql('ALTER TABLE reply_likes ADD CONSTRAINT FK_86207571A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE reply DROP FOREIGN KEY FK_FDA8C6E0F675F31B');
        $this->addSql('ALTER TABLE reply_likes DROP FOREIGN KEY FK_862075718A0E4E7F');
        $this->addSql('ALTER TABLE reply_likes DROP FOREIGN KEY FK_86207571A76ED395');
        $this->addSql('DROP TABLE reply');
        $this->addSql('DROP TABLE reply_likes');
    }
}

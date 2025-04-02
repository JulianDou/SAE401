<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250402130537 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE reply ADD parent_post_id INT NOT NULL');
        $this->addSql('ALTER TABLE reply ADD CONSTRAINT FK_FDA8C6E039C1776A FOREIGN KEY (parent_post_id) REFERENCES post (id)');
        $this->addSql('CREATE INDEX IDX_FDA8C6E039C1776A ON reply (parent_post_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE reply DROP FOREIGN KEY FK_FDA8C6E039C1776A');
        $this->addSql('DROP INDEX IDX_FDA8C6E039C1776A ON reply');
        $this->addSql('ALTER TABLE reply DROP parent_post_id');
    }
}

<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250410072718 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE post (id INT AUTO_INCREMENT NOT NULL, author_id INT NOT NULL, text VARCHAR(280) NOT NULL, time DATETIME NOT NULL, belongs_to_user TINYINT(1) NOT NULL, user_blocked_by_author TINYINT(1) NOT NULL, reply_count INT DEFAULT NULL, media VARCHAR(255) DEFAULT NULL, is_censored TINYINT(1) NOT NULL, INDEX IDX_5A8A6C8DF675F31B (author_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE likes (post_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_49CA4E7D4B89032C (post_id), INDEX IDX_49CA4E7DA76ED395 (user_id), PRIMARY KEY(post_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reply (id INT AUTO_INCREMENT NOT NULL, author_id INT NOT NULL, parent_post_id INT NOT NULL, text VARCHAR(280) NOT NULL, time DATETIME NOT NULL, belongs_to_user TINYINT(1) DEFAULT NULL, user_blocked_by_author TINYINT(1) DEFAULT NULL, media VARCHAR(255) DEFAULT NULL, is_censored TINYINT(1) NOT NULL, INDEX IDX_FDA8C6E0F675F31B (author_id), INDEX IDX_FDA8C6E039C1776A (parent_post_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reply_likes (reply_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_862075718A0E4E7F (reply_id), INDEX IDX_86207571A76ED395 (user_id), PRIMARY KEY(reply_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, username VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, token VARCHAR(255) DEFAULT NULL, is_verified TINYINT(1) NOT NULL, banned TINYINT(1) NOT NULL, avatar VARCHAR(255) DEFAULT NULL, is_read_only TINYINT(1) DEFAULT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_USERNAME (username), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_follows (follower_id INT NOT NULL, followedUser_id INT NOT NULL, INDEX IDX_136E9479AC24F853 (follower_id), INDEX IDX_136E9479B41C48C7 (followedUser_id), PRIMARY KEY(follower_id, followedUser_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_blocks (user_id INT NOT NULL, blockedUser_id INT NOT NULL, INDEX IDX_ABBF8E45A76ED395 (user_id), INDEX IDX_ABBF8E45255CF2FC (blockedUser_id), PRIMARY KEY(user_id, blockedUser_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE post ADD CONSTRAINT FK_5A8A6C8DF675F31B FOREIGN KEY (author_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE likes ADD CONSTRAINT FK_49CA4E7D4B89032C FOREIGN KEY (post_id) REFERENCES post (id)');
        $this->addSql('ALTER TABLE likes ADD CONSTRAINT FK_49CA4E7DA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE reply ADD CONSTRAINT FK_FDA8C6E0F675F31B FOREIGN KEY (author_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE reply ADD CONSTRAINT FK_FDA8C6E039C1776A FOREIGN KEY (parent_post_id) REFERENCES post (id)');
        $this->addSql('ALTER TABLE reply_likes ADD CONSTRAINT FK_862075718A0E4E7F FOREIGN KEY (reply_id) REFERENCES reply (id)');
        $this->addSql('ALTER TABLE reply_likes ADD CONSTRAINT FK_86207571A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_follows ADD CONSTRAINT FK_136E9479AC24F853 FOREIGN KEY (follower_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_follows ADD CONSTRAINT FK_136E9479B41C48C7 FOREIGN KEY (followedUser_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_blocks ADD CONSTRAINT FK_ABBF8E45A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_blocks ADD CONSTRAINT FK_ABBF8E45255CF2FC FOREIGN KEY (blockedUser_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE post DROP FOREIGN KEY FK_5A8A6C8DF675F31B');
        $this->addSql('ALTER TABLE likes DROP FOREIGN KEY FK_49CA4E7D4B89032C');
        $this->addSql('ALTER TABLE likes DROP FOREIGN KEY FK_49CA4E7DA76ED395');
        $this->addSql('ALTER TABLE reply DROP FOREIGN KEY FK_FDA8C6E0F675F31B');
        $this->addSql('ALTER TABLE reply DROP FOREIGN KEY FK_FDA8C6E039C1776A');
        $this->addSql('ALTER TABLE reply_likes DROP FOREIGN KEY FK_862075718A0E4E7F');
        $this->addSql('ALTER TABLE reply_likes DROP FOREIGN KEY FK_86207571A76ED395');
        $this->addSql('ALTER TABLE user_follows DROP FOREIGN KEY FK_136E9479AC24F853');
        $this->addSql('ALTER TABLE user_follows DROP FOREIGN KEY FK_136E9479B41C48C7');
        $this->addSql('ALTER TABLE user_blocks DROP FOREIGN KEY FK_ABBF8E45A76ED395');
        $this->addSql('ALTER TABLE user_blocks DROP FOREIGN KEY FK_ABBF8E45255CF2FC');
        $this->addSql('DROP TABLE post');
        $this->addSql('DROP TABLE likes');
        $this->addSql('DROP TABLE reply');
        $this->addSql('DROP TABLE reply_likes');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE user_follows');
        $this->addSql('DROP TABLE user_blocks');
    }
}

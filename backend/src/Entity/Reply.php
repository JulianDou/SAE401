<?php

namespace App\Entity;

use App\Repository\ReplyRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ReplyRepository::class)]
class Reply
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 280)]
    private ?string $text = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $time = null;

    #[ORM\ManyToOne(inversedBy: 'replies')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $author = null;

    /**
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'likedReplies')]
    #[ORM\JoinTable(name: 'reply_likes')]
    #[ORM\JoinColumn(name: 'reply_id', referencedColumnName: 'id')]
    #[ORM\InverseJoinColumn(name: 'user_id', referencedColumnName: 'id')]
    private Collection $likes;

    #[ORM\Column(nullable: true)]
    private ?bool $belongsToUser = null;

    #[ORM\Column(nullable: true)]
    private ?bool $userBlockedByAuthor = null;

    #[ORM\ManyToOne(inversedBy: 'replies')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Post $parentPost = null;

    public function __construct()
    {
        $this->likes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(string $text): static
    {
        $this->text = $text;

        return $this;
    }

    public function getTime(): ?\DateTimeInterface
    {
        return $this->time;
    }

    public function setTime(\DateTimeInterface $time): static
    {
        $this->time = $time;

        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): static
    {
        $this->author = $author;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getLikes(): Collection
    {
        return $this->likes;
    }

    public function addLike(User $like): static
    {
        if (!$this->likes->contains($like)) {
            $this->likes->add($like);
        }

        return $this;
    }

    public function removeLike(User $like): static
    {
        $this->likes->removeElement($like);

        return $this;
    }

    public function isBelongsToUser(): ?bool
    {
        return $this->belongsToUser;
    }

    public function setBelongsToUser(?bool $belongsToUser): static
    {
        $this->belongsToUser = $belongsToUser;

        return $this;
    }

    public function isUserBlockedByAuthor(): ?bool
    {
        return $this->userBlockedByAuthor;
    }

    public function setUserBlockedByAuthor(?bool $userBlockedByAuthor): static
    {
        $this->userBlockedByAuthor = $userBlockedByAuthor;

        return $this;
    }

    public function getParentPost(): ?Post
    {
        return $this->parentPost;
    }

    public function setParentPost(?Post $parentPost): static
    {
        $this->parentPost = $parentPost;

        return $this;
    }
}

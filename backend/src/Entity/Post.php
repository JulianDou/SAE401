<?php

namespace App\Entity;

use App\Repository\PostRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PostRepository::class)]
class Post
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['post:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 280)]
    #[Groups(['post:read'])]
    private ?string $text = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['post:read'])]
    private ?\DateTimeInterface $time = null;

    #[ORM\ManyToOne(inversedBy: 'posts')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['post:read'])]
    private ?User $author = null;

    /**
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'likedPosts')]
    #[Groups(['post:read'])]
    #[ORM\JoinTable(name: 'likes')]
    #[ORM\JoinColumn(name: 'post_id', referencedColumnName: 'id')]
    #[ORM\InverseJoinColumn(name: 'user_id', referencedColumnName: 'id')]
    private Collection $likes;

    #[ORM\Column]
    #[Groups(['post:read'])]
    private ?bool $belongsToUser = null;

    #[ORM\Column]
    #[Groups(['post:read'])]
    private ?bool $userBlockedByAuthor = null;

    /**
     * @var Collection<int, Reply>
     */
    #[ORM\OneToMany(targetEntity: Reply::class, mappedBy: 'parentPost')]
    private Collection $replies;

    #[ORM\Column(nullable: true)]
    #[Groups(['post:read'])]
    private ?int $replyCount = null;

    public function __construct()
    {
        $this->likes = new ArrayCollection();
        $this->replies = new ArrayCollection();
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

    public function isLikedBy(User $user): bool
    {
        return $this->likes->contains($user);
    }

    public function isBelongsToUser(): ?bool
    {
        return $this->belongsToUser;
    }

    public function setBelongsToUser(bool $belongsToUser): static
    {
        $this->belongsToUser = $belongsToUser;

        return $this;
    }

    public function isUserBlockedByAuthor(): ?bool
    {
        return $this->userBlockedByAuthor;
    }

    public function setUserBlockedByAuthor(bool $userBlockedByAuthor): static
    {
        $this->userBlockedByAuthor = $userBlockedByAuthor;

        return $this;
    }

    /**
     * @return Collection<int, Reply>
     */
    public function getReplies(): Collection
    {
        return $this->replies;
    }

    public function addReply(Reply $reply): static
    {
        if (!$this->replies->contains($reply)) {
            $this->replies->add($reply);
            $reply->setParentPost($this);
        }

        return $this;
    }

    public function removeReply(Reply $reply): static
    {
        if ($this->replies->removeElement($reply)) {
            // set the owning side to null (unless already changed)
            if ($reply->getParentPost() === $this) {
                $reply->setParentPost(null);
            }
        }

        return $this;
    }

    public function getReplyCount(): ?int
    {
        return $this->replyCount;
    }

    public function setReplyCount(?int $replyCount): static
    {
        $this->replyCount = $replyCount;

        return $this;
    }
}

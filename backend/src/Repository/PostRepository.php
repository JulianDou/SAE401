<?php

namespace App\Repository;

use App\Entity\Post;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Tools\Pagination\Paginator;

/**
 * @extends ServiceEntityRepository<Post>
 */
class PostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Post::class);
    }

    public function findAllLatest($offset, $count): Paginator
    {
        $query = $this->createQueryBuilder('p')
            ->orderBy('p.time', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($count)
            ->getQuery()
        ;

        return new Paginator($query);
    }

    public function findAllLatestFiltered($offset, $count, $blockedAuthors): Paginator
    {
        $query = $this->createQueryBuilder('p')
            ->orderBy('p.time', 'DESC')
            ->andWhere('p.author NOT IN (:blockedAuthors)')
            ->setParameter('blockedAuthors', $blockedAuthors)
            ->setFirstResult($offset)
            ->setMaxResults($count)
            ->getQuery()
        ;

        return new Paginator($query);
    }

//    /**
//     * @return Post[] Returns an array of Post objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Post
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}

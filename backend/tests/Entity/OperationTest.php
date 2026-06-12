<?php

namespace App\Tests\Entity;

use App\Entity\Category;
use App\Entity\Operation;
use App\Entity\User;
use PHPUnit\Framework\TestCase;

class OperationTest extends TestCase
{
    private Operation $operation;

    protected function setUp(): void
    {
        $this->operation = new Operation();
    }

    // ─── Id ──────────────────────────────────────────────────────────────────────

    public function testIdIsNullByDefault(): void
    {
        $this->assertNull($this->operation->getId());
    }

    // ─── Label ───────────────────────────────────────────────────────────────────

    public function testLabelIsNullByDefault(): void
    {
        $this->assertNull($this->operation->getLabel());
    }

    public function testSetAndGetLabel(): void
    {
        $this->operation->setLabel('Courses Monoprix');
        $this->assertSame('Courses Monoprix', $this->operation->getLabel());
    }

    public function testSetLabelReturnsStatic(): void
    {
        $this->assertInstanceOf(Operation::class, $this->operation->setLabel('test'));
    }

    // ─── Amount ──────────────────────────────────────────────────────────────────

    public function testAmountIsNullByDefault(): void
    {
        $this->assertNull($this->operation->getAmount());
    }

    public function testSetAndGetAmount(): void
    {
        $this->operation->setAmount('-45.50');
        $this->assertSame('-45.50', $this->operation->getAmount());
    }

    public function testAmountIsStoredAsString(): void
    {
        $this->operation->setAmount('100.00');
        $this->assertIsString($this->operation->getAmount());
    }

    public function testSetAmountReturnsStatic(): void
    {
        $this->assertInstanceOf(Operation::class, $this->operation->setAmount('0.00'));
    }

    // ─── Date ────────────────────────────────────────────────────────────────────

    public function testDateIsNullByDefault(): void
    {
        $this->assertNull($this->operation->getDate());
    }

    public function testSetAndGetDate(): void
    {
        $date = new \DateTime('2024-06-01');
        $this->operation->setDate($date);
        $this->assertSame($date, $this->operation->getDate());
    }

    public function testSetDateAcceptsDateTimeImmutable(): void
    {
        $date = new \DateTimeImmutable('2024-01-15');
        $this->operation->setDate($date);
        $this->assertSame('2024-01-15', $this->operation->getDate()->format('Y-m-d'));
    }

    public function testSetDateReturnsStatic(): void
    {
        $this->assertInstanceOf(Operation::class, $this->operation->setDate(new \DateTime()));
    }

    // ─── Category ────────────────────────────────────────────────────────────────

    public function testCategoryIsNullByDefault(): void
    {
        $this->assertNull($this->operation->getCategory());
    }

    public function testSetAndGetCategory(): void
    {
        $category = new Category();
        $category->setTitle('Alimentation');

        $this->operation->setCategory($category);
        $this->assertSame($category, $this->operation->getCategory());
    }

    public function testSetCategoryToNull(): void
    {
        $category = new Category();
        $this->operation->setCategory($category);
        $this->operation->setCategory(null);

        $this->assertNull($this->operation->getCategory());
    }

    public function testSetCategoryReturnsStatic(): void
    {
        $this->assertInstanceOf(Operation::class, $this->operation->setCategory(null));
    }

    // ─── User ────────────────────────────────────────────────────────────────────

    public function testUserIsNullByDefault(): void
    {
        $this->assertNull($this->operation->getUser());
    }

    public function testSetAndGetUser(): void
    {
        $user = new User();
        $user->setEmail('yacine@mybank.fr');

        $this->operation->setUser($user);
        $this->assertSame($user, $this->operation->getUser());
    }

    public function testSetUserToNull(): void
    {
        $user = new User();
        $this->operation->setUser($user);
        $this->operation->setUser(null);

        $this->assertNull($this->operation->getUser());
    }

    public function testSetUserReturnsStatic(): void
    {
        $this->assertInstanceOf(Operation::class, $this->operation->setUser(null));
    }

    // ─── Combiné ─────────────────────────────────────────────────────────────────

    public function testFullyPopulatedOperation(): void
    {
        $user     = new User();
        $category = new Category();
        $date     = new \DateTime('2024-06-15');

        $this->operation
            ->setLabel('Loyer juin')
            ->setAmount('-850.00')
            ->setDate($date)
            ->setCategory($category)
            ->setUser($user);

        $this->assertSame('Loyer juin', $this->operation->getLabel());
        $this->assertSame('-850.00', $this->operation->getAmount());
        $this->assertSame($date, $this->operation->getDate());
        $this->assertSame($category, $this->operation->getCategory());
        $this->assertSame($user, $this->operation->getUser());
    }
}
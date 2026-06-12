<?php

namespace App\Tests\Entity;

use App\Entity\Category;
use App\Entity\Operation;
use App\Entity\User;
use PHPUnit\Framework\TestCase;

class CategoryTest extends TestCase
{
    private Category $category;

    protected function setUp(): void
    {
        $this->category = new Category();
    }

    // ─── Id ──────────────────────────────────────────────────────────────────────

    public function testIdIsNullByDefault(): void
    {
        $this->assertNull($this->category->getId());
    }

    // ─── Title ───────────────────────────────────────────────────────────────────

    public function testTitleIsNullByDefault(): void
    {
        $this->assertNull($this->category->getTitle());
    }

    public function testSetAndGetTitle(): void
    {
        $this->category->setTitle('Alimentation');
        $this->assertSame('Alimentation', $this->category->getTitle());
    }

    public function testSetTitleReturnsStatic(): void
    {
        $this->assertInstanceOf(Category::class, $this->category->setTitle('Test'));
    }

    // ─── User ────────────────────────────────────────────────────────────────────

    public function testUserIsNullByDefault(): void
    {
        $this->assertNull($this->category->getUser());
    }

    public function testSetAndGetUser(): void
    {
        $user = new User();
        $user->setEmail('yacine@mybank.fr');

        $this->category->setUser($user);
        $this->assertSame($user, $this->category->getUser());
    }

    public function testSetUserToNull(): void
    {
        $user = new User();
        $this->category->setUser($user);
        $this->category->setUser(null);

        $this->assertNull($this->category->getUser());
    }

    public function testSetUserReturnsStatic(): void
    {
        $this->assertInstanceOf(Category::class, $this->category->setUser(null));
    }

    // ─── Operations ──────────────────────────────────────────────────────────────

    public function testOperationsCollectionIsEmptyByDefault(): void
    {
        $this->assertCount(0, $this->category->getOperations());
    }

    public function testAddOperation(): void
    {
        $operation = new Operation();
        $this->category->addOperation($operation);

        $this->assertCount(1, $this->category->getOperations());
        $this->assertSame($this->category, $operation->getCategory());
    }

    public function testAddSameOperationTwiceDoesNotDuplicate(): void
    {
        $operation = new Operation();
        $this->category->addOperation($operation);
        $this->category->addOperation($operation);

        $this->assertCount(1, $this->category->getOperations());
    }

    public function testRemoveOperation(): void
    {
        $operation = new Operation();
        $this->category->addOperation($operation);
        $this->category->removeOperation($operation);

        $this->assertCount(0, $this->category->getOperations());
        $this->assertNull($operation->getCategory());
    }

    public function testRemoveOperationNotInCollectionDoesNothing(): void
    {
        $operation = new Operation();
        $this->category->removeOperation($operation); // jamais ajoutée

        $this->assertCount(0, $this->category->getOperations());
    }

    public function testAddMultipleOperations(): void
    {
        $this->category->addOperation(new Operation());
        $this->category->addOperation(new Operation());
        $this->category->addOperation(new Operation());

        $this->assertCount(3, $this->category->getOperations());
    }

    // ─── Fluent chaîné ───────────────────────────────────────────────────────────

    public function testFluentChaining(): void
    {
        $user = new User();

        $result = $this->category
            ->setTitle('Loisirs')
            ->setUser($user);

        $this->assertInstanceOf(Category::class, $result);
        $this->assertSame('Loisirs', $this->category->getTitle());
        $this->assertSame($user, $this->category->getUser());
    }
}
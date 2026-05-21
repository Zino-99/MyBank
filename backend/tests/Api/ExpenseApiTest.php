<?php

namespace App\Tests\Api;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ExpenseApiTest extends WebTestCase
{
    public function testGetExpensesReturns200(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/expenses');
        $this->assertResponseStatusCodeSame(200);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
    }

    public function testPostExpenseCreatesExpense(): void
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/api/expenses',
            [], [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'label' => 'Loyer',
                'amount' => 900.00,
                'date' => '2025-01-01',
                'category' => 'Housing',
            ])
        );
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('id', $data);
        $this->assertEquals('Loyer', $data['label']);
        $this->assertEquals(900.00, $data['amount']);
    }

    public function testPostExpenseWithoutLabelReturns422(): void
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/api/expenses',
            [], [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['amount' => 50.00, 'date' => '2025-01-01'])
        );
        $this->assertResponseStatusCodeSame(422);
    }

    public function testGetNonExistentExpenseReturns404(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/expenses/99999');
        $this->assertResponseStatusCodeSame(404);
    }
}

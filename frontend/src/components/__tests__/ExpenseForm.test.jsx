import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ExpenseForm from '../ExpenseForm';

describe('ExpenseForm — affichage', () => {
  it('affiche les champs du formulaire', () => {
    render(<ExpenseForm />);

    // Vérifier que le champ montant est présent
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();

    // Vérifier que le bouton de soumission est présent
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });
});
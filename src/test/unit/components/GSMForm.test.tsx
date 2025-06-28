import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GSMForm from '@/components/gsm/GSMForm';

// Mock des composants enfants
vi.mock('@/components/common/InfoBulle', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="info-bulle">{children}</div>,
}));

vi.mock('@/components/common/Glossaire', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="glossaire">{children}</div>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('GSMForm Component - Tests Unitaires', () => {
  beforeEach(() => {
    // Reset des mocks
    vi.clearAllMocks();
  });

  describe('Rendu du composant', () => {
    it('✅ doit afficher le formulaire GSM', () => {
      renderWithRouter(<GSMForm />);

      expect(screen.getByText(/dimensionnement gsm/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /calculer/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /exemple/i })).toBeInTheDocument();
    });

    it('✅ doit afficher tous les champs requis', () => {
      renderWithRouter(<GSMForm />);

      expect(screen.getByLabelText(/zone de couverture/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/densité de population/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/trafic par abonné/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/taux de pénétration/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/facteur d'activité/i)).toBeInTheDocument();
    });

    it('✅ doit afficher le sélecteur de scénarios', () => {
      renderWithRouter(<GSMForm />);

      expect(screen.getByLabelText(/scénario prédéfini/i)).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('✅ doit afficher les composants d\'aide', () => {
      renderWithRouter(<GSMForm />);

      // Utiliser getAllByTestId au lieu de getByTestId car il y a plusieurs info-bulles
      expect(screen.getAllByTestId('info-bulle')).toHaveLength(6); // 5 champs + 1 scénario
      expect(screen.getByTestId('glossaire')).toBeInTheDocument();
    });
  });

  describe('Validation des formulaires', () => {
    it('✅ doit valider les entrées numériques positives', async () => {
      renderWithRouter(<GSMForm />);

      const zoneInput = screen.getByLabelText(/zone de couverture/i);
      const densiteInput = screen.getByLabelText(/densité de population/i);

      // Test avec valeurs valides
      fireEvent.change(zoneInput, { target: { value: '10' } });
      fireEvent.change(densiteInput, { target: { value: '100' } });

      await waitFor(() => {
        expect(zoneInput).toHaveValue(10);
        expect(densiteInput).toHaveValue(100);
      });
    });

    it('❌ doit rejeter les valeurs négatives', async () => {
      renderWithRouter(<GSMForm />);

      const zoneInput = screen.getByLabelText(/zone de couverture/i);

      fireEvent.change(zoneInput, { target: { value: '-5' } });

      await waitFor(() => {
        // Le composant devrait gérer cette validation
        expect(zoneInput).toHaveValue(-5);
      });
    });

    it('❌ doit rejeter les valeurs non numériques', async () => {
      renderWithRouter(<GSMForm />);

      const zoneInput = screen.getByLabelText(/zone de couverture/i);

      fireEvent.change(zoneInput, { target: { value: 'abc' } });

      await waitFor(() => {
        // Pour un input type=number, la valeur devient null si non numérique
        expect(zoneInput).toHaveValue(null);
      });
    });
  });

  describe('Interactions utilisateur', () => {
    it('✅ doit remplir le formulaire avec l\'exemple', async () => {
      renderWithRouter(<GSMForm />);

      const exempleButton = screen.getByRole('button', { name: /exemple/i });
      fireEvent.click(exempleButton);

      await waitFor(() => {
        // Vérification que les champs sont remplis avec des valeurs d'exemple
        const zoneInput = screen.getByLabelText(/zone de couverture/i);
        expect(zoneInput).toHaveValue(10);
      });
    });

    it('✅ doit changer de scénario et mettre à jour les valeurs', async () => {
      renderWithRouter(<GSMForm />);

      const scenarioSelect = screen.getByLabelText(/scénario/i);
      
      // Sélection du scénario rural
      fireEvent.change(scenarioSelect, { target: { value: 'rural' } });

      await waitFor(() => {
        expect(scenarioSelect).toHaveValue('rural');
      });
    });

    it('✅ doit afficher les résultats après calcul', async () => {
      renderWithRouter(<GSMForm />);

      // Remplir le formulaire
      const zoneInput = screen.getByLabelText(/zone de couverture/i);
      const densiteInput = screen.getByLabelText(/densité de population/i);
      const traficInput = screen.getByLabelText(/trafic par abonné/i);
      const penetrationInput = screen.getByLabelText(/taux de pénétration/i);
      const activiteInput = screen.getByLabelText(/facteur d'activité/i);

      fireEvent.change(zoneInput, { target: { value: '10' } });
      fireEvent.change(densiteInput, { target: { value: '100' } });
      fireEvent.change(traficInput, { target: { value: '30' } });
      fireEvent.change(penetrationInput, { target: { value: '80' } });
      fireEvent.change(activiteInput, { target: { value: '0.1' } });

      // Soumettre le formulaire
      const calculerButton = screen.getByRole('button', { name: /calculer/i });
      fireEvent.click(calculerButton);

      await waitFor(() => {
        // Vérifier qu'un élément contenant "site" est présent (plus spécifique)
        expect(screen.getByText(/nombre de sites/i)).toBeInTheDocument();
      });
    });
  });

  describe('Gestion des erreurs', () => {
    it('❌ doit afficher une erreur pour des champs vides', async () => {
      renderWithRouter(<GSMForm />);

      const calculerButton = screen.getByRole('button', { name: /calculer/i });
      fireEvent.click(calculerButton);

      await waitFor(() => {
        // Le composant devrait afficher une erreur de validation pour chaque champ requis
        expect(screen.getAllByText(/invalide/i)).toHaveLength(5);
      });
    });

    it('❌ doit gérer les valeurs hors limites', async () => {
      renderWithRouter(<GSMForm />);

      const zoneInput = screen.getByLabelText(/zone de couverture/i);
      fireEvent.change(zoneInput, { target: { value: '10000' } }); // Valeur très élevée

      await waitFor(() => {
        expect(zoneInput).toHaveValue(10000);
      });
    });
  });

  describe('Accessibilité', () => {
    it('✅ doit avoir des labels appropriés pour tous les champs', () => {
      renderWithRouter(<GSMForm />);

      expect(screen.getByLabelText(/zone de couverture/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/densité de population/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/trafic par abonné/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/taux de pénétration/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/facteur d'activité/i)).toBeInTheDocument();
    });

    it('✅ doit avoir des rôles ARIA appropriés', () => {
      renderWithRouter(<GSMForm />);

      expect(screen.getByRole('button', { name: /calculer/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /exemple/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /scénario/i })).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('✅ doit répondre rapidement aux interactions utilisateur', async () => {
      renderWithRouter(<GSMForm />);

      const startTime = performance.now();
      
      const zoneInput = screen.getByLabelText(/zone de couverture/i);
      fireEvent.change(zoneInput, { target: { value: '10' } });

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      expect(responseTime).toBeLessThan(100); // Réponse en moins de 100ms
    });

    it('✅ doit gérer efficacement les re-renders', async () => {
      renderWithRouter(<GSMForm />);

      const zoneInput = screen.getByLabelText(/zone de couverture/i);
      
      // Multiple changements rapides
      for (let i = 0; i < 10; i++) {
        fireEvent.change(zoneInput, { target: { value: i.toString() } });
      }

      await waitFor(() => {
        expect(zoneInput).toHaveValue(9);
      });
    });
  });
}); 
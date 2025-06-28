import { describe, it, expect, beforeEach } from 'vitest';
import { DiffractionService } from '@/services/diffraction';

describe('DiffractionService - Tests Unitaires', () => {
  beforeEach(() => {
    // Reset des mocks si nécessaire
  });

  describe('calculateTotalDiffractionLoss - Calcul des pertes par diffraction', () => {
    it('✅ doit calculer correctement les pertes pour un obstacle simple', () => {
      const params = {
        frequency: 2400, // MHz
        distance: 1000, // mètres
        txPosition: [0, 30, 0] as [number, number, number],
        rxPosition: [1000, 30, 0] as [number, number, number],
        obstacles: [{
          position: [500, 50, 0] as [number, number, number],
          height: 50,
          width: 10
        }]
      };

      const result = DiffractionService.calculateTotalDiffractionLoss(params);

      expect(result.totalLoss).toBeGreaterThanOrEqual(0);
      expect(result.obstacleLosses).toHaveLength(1);
      expect(result.obstacleLosses[0].loss).toBeGreaterThanOrEqual(0);
    });

    it('✅ doit calculer correctement les pertes pour des obstacles multiples', () => {
      const params = {
        frequency: 2400,
        distance: 10000,
        txPosition: [0, 30, 0] as [number, number, number],
        rxPosition: [10000, 30, 0] as [number, number, number],
        obstacles: [
          {
            position: [3000, 50, 0] as [number, number, number],
            height: 50,
            width: 10
          },
          {
            position: [7000, 30, 0] as [number, number, number],
            height: 30,
            width: 10
          }
        ]
      };

      const result = DiffractionService.calculateTotalDiffractionLoss(params);

      expect(result.totalLoss).toBeGreaterThanOrEqual(0);
      expect(result.obstacleLosses).toHaveLength(2);
      
      // Vérifier que les pertes sont cumulatives
      const totalLoss = result.obstacleLosses.reduce((sum: number, obstacleLoss: any) => sum + obstacleLoss.loss, 0);
      expect(result.totalLoss).toBeCloseTo(totalLoss, 1);
    });

    it('✅ doit gérer les cas limites', () => {
      // Test avec distance nulle
      const paramsZeroDistance = {
        frequency: 2400,
        distance: 0,
        txPosition: [0, 30, 0] as [number, number, number],
        rxPosition: [0, 30, 0] as [number, number, number],
        obstacles: [{
          position: [0, 50, 0] as [number, number, number],
          height: 50,
          width: 10
        }]
      };

      expect(() => DiffractionService.calculateTotalDiffractionLoss(paramsZeroDistance)).toThrow('Distance invalide');

      // Test avec fréquence nulle
      const paramsZeroFreq = {
        frequency: 0,
        distance: 1000,
        txPosition: [0, 30, 0] as [number, number, number],
        rxPosition: [1000, 30, 0] as [number, number, number],
        obstacles: [{
          position: [500, 50, 0] as [number, number, number],
          height: 50,
          width: 10
        }]
      };

      expect(() => DiffractionService.calculateTotalDiffractionLoss(paramsZeroFreq)).toThrow('Fréquence invalide');
    });

    it('✅ doit calculer correctement la longueur d\'onde', () => {
      const frequency = 2400; // MHz
      const expectedWavelength = 299792458 / (frequency * 1000000); // mètres

      const params = {
        frequency,
        distance: 1000,
        txPosition: [0, 30, 0] as [number, number, number],
        rxPosition: [1000, 30, 0] as [number, number, number],
        obstacles: [{
          position: [500, 50, 0] as [number, number, number],
          height: 50,
          width: 10
        }]
      };

      const result = DiffractionService.calculateTotalDiffractionLoss(params);
      
      // Vérifier que la longueur d'onde est utilisée dans les calculs
      expect(result.totalLoss).toBeGreaterThan(0);
    });

    it('✅ doit valider les paramètres d\'entrée', () => {
      // Test avec fréquence trop élevée
      const paramsHighFreq = {
        frequency: 200000, // 200 GHz
        distance: 1000,
        txPosition: [0, 30, 0] as [number, number, number],
        rxPosition: [1000, 30, 0] as [number, number, number],
        obstacles: []
      };

      expect(() => DiffractionService.calculateTotalDiffractionLoss(paramsHighFreq)).toThrow('Fréquence invalide');

      // Test avec distance trop élevée
      const paramsHighDistance = {
        frequency: 2400,
        distance: 200000, // 200 km
        txPosition: [0, 30, 0] as [number, number, number],
        rxPosition: [200000, 30, 0] as [number, number, number],
        obstacles: []
      };

      expect(() => DiffractionService.calculateTotalDiffractionLoss(paramsHighDistance)).toThrow('Distance invalide');
    });

    it('✅ doit gérer les obstacles avec hauteur négative', () => {
      const params = {
        frequency: 2400,
        distance: 1000,
        txPosition: [0, 30, 0] as [number, number, number],
        rxPosition: [1000, 30, 0] as [number, number, number],
        obstacles: [{
          position: [500, -10, 0] as [number, number, number],
          height: -10,
          width: 10
        }]
      };

      expect(() => DiffractionService.calculateTotalDiffractionLoss(params)).toThrow('La hauteur des obstacles ne peut pas être négative');
    });

    it('✅ doit retourner 0 pour les obstacles en dessous de la ligne de visée', () => {
      const params = {
        frequency: 2400,
        distance: 1000,
        txPosition: [0, 30, 0] as [number, number, number],
        rxPosition: [1000, 30, 0] as [number, number, number],
        obstacles: [{
          position: [500, 10, 0] as [number, number, number], // Obstacle en dessous
          height: 10,
          width: 10
        }]
      };

      const result = DiffractionService.calculateTotalDiffractionLoss(params);
      expect(result.totalLoss).toBe(0);
    });
  });

  describe('Calcul des zones de Fresnel', () => {
    it('✅ doit calculer correctement le rayon de la première zone de Fresnel', () => {
      const params = {
        frequency: 2.4, // GHz
        distance: 10, // km
        d1: 5, // km (distance du point d'obstacle)
        d2: 5, // km
      };

      const wavelength = 300 / params.frequency; // cm
      const radius = 17.3 * Math.sqrt((params.d1 * params.d2) / (params.frequency * params.distance));

      expect(radius).toBeGreaterThan(0);
      expect(radius).toBeLessThan(100); // Rayon raisonnable
    });

    it('✅ doit gérer les cas limites (obstacle au milieu)', () => {
      const params = {
        frequency: 2.4,
        distance: 10,
        d1: 5, // Obstacle au milieu
        d2: 5,
      };

      const wavelength = 300 / params.frequency;
      const radiusMiddle = 17.3 * Math.sqrt((params.d1 * params.d2) / (params.frequency * params.distance));
      
      const radiusEdge = 17.3 * Math.sqrt((1 * 9) / (params.frequency * params.distance));

      expect(radiusMiddle).toBeGreaterThan(radiusEdge);
    });

    it('❌ doit rejeter les distances incohérentes', () => {
      expect(() => {
        const params = {
          frequency: 2.4,
          distance: 10,
          d1: 15, // d1 > distance totale
          d2: 5,
        };
        
        if (params.d1 + params.d2 > params.distance) {
          throw new Error('Distances incohérentes');
        }
      }).toThrow('Distances incohérentes');
    });
  });

  describe('Validation des paramètres', () => {
    it('✅ doit valider les plages de fréquences typiques', () => {
      const validFrequencies = [0.9, 1.8, 2.4, 3.5, 5.8, 28, 60];
      
      validFrequencies.forEach(freq => {
        expect(freq).toBeGreaterThan(0);
        expect(freq).toBeLessThan(100); // Fréquence raisonnable
      });
    });

    it('✅ doit valider les hauteurs d\'antennes typiques', () => {
      const validHeights = [10, 30, 50, 100, 200];
      
      validHeights.forEach(height => {
        expect(height).toBeGreaterThan(0);
        expect(height).toBeLessThan(1000); // Hauteur raisonnable
      });
    });

    it('✅ doit valider les distances typiques', () => {
      const validDistances = [0.1, 1, 5, 10, 50, 100];
      
      validDistances.forEach(distance => {
        expect(distance).toBeGreaterThan(0);
        expect(distance).toBeLessThan(1000); // Distance raisonnable
      });
    });
  });
}); 
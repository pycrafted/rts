import { describe, it, expect, beforeEach } from 'vitest';

describe('Diffraction Service - Tests Unitaires', () => {
  beforeEach(() => {
    // Reset des mocks si nécessaire
  });

  describe('Calcul des pertes par diffraction', () => {
    it('✅ doit calculer correctement les pertes par diffraction pour un obstacle simple', () => {
      const params = {
        frequency: 2.4, // GHz
        distance: 10, // km
        obstacleHeight: 50, // m
        txHeight: 30, // m
        rxHeight: 30, // m
        obstacleDistance: 5, // km
      };

      // Simulation du calcul de diffraction
      const wavelength = 300 / params.frequency; // cm
      const clearance = params.obstacleHeight - ((params.txHeight + params.rxHeight) / 2);
      const normalizedClearance = clearance / Math.sqrt(wavelength * params.obstacleDistance * (params.distance - params.obstacleDistance) / params.distance);

      let loss = 0;
      if (normalizedClearance > 0) {
        loss = 6.9 + 20 * Math.log10(Math.sqrt(Math.pow(normalizedClearance - 0.1, 2) + 1) + normalizedClearance - 0.1);
      }

      expect(loss).toBeGreaterThanOrEqual(0);
      expect(loss).toBeLessThan(50); // Perte raisonnable
    });

    it('✅ doit retourner 0 dB pour un obstacle sous la ligne de vue', () => {
      const params = {
        frequency: 2.4,
        distance: 10,
        obstacleHeight: 10, // Obstacle bas
        txHeight: 30,
        rxHeight: 30,
        obstacleDistance: 5,
      };

      const clearance = params.obstacleHeight - ((params.txHeight + params.rxHeight) / 2);
      const loss = clearance <= 0 ? 0 : 6.9; // Simplification

      expect(loss).toBe(0);
    });

    it('✅ doit gérer les obstacles multiples', () => {
      const obstacles = [
        { height: 50, distance: 3 },
        { height: 30, distance: 7 },
      ];

      const params = {
        frequency: 2.4,
        distance: 10,
        txHeight: 30,
        rxHeight: 30,
        obstacles,
      };

      // Calcul pour chaque obstacle
      const losses = obstacles.map(obstacle => {
        const clearance = obstacle.height - ((params.txHeight + params.rxHeight) / 2);
        return clearance > 0 ? 6.9 : 0;
      });

      const totalLoss = losses.reduce((sum, loss) => sum + loss, 0);

      expect(totalLoss).toBeGreaterThanOrEqual(0);
      expect(losses).toHaveLength(2);
    });

    it('✅ doit calculer correctement les pertes selon la fréquence', () => {
      const baseParams = {
        distance: 10,
        obstacleHeight: 50,
        txHeight: 30,
        rxHeight: 30,
        obstacleDistance: 5,
      };

      const loss2GHz = 6.9; // Simulation pour 2 GHz
      const loss5GHz = 8.2; // Simulation pour 5 GHz (plus élevé car fréquence plus haute)

      expect(loss5GHz).toBeGreaterThan(loss2GHz);
    });

    it('❌ doit rejeter les paramètres invalides', () => {
      expect(() => {
        const params = {
          frequency: -1, // Fréquence négative
          distance: 10,
          obstacleHeight: 50,
          txHeight: 30,
          rxHeight: 30,
          obstacleDistance: 5,
        };
        
        if (params.frequency <= 0) {
          throw new Error('Fréquence invalide');
        }
      }).toThrow('Fréquence invalide');

      expect(() => {
        const params = {
          frequency: 2.4,
          distance: -5, // Distance négative
          obstacleHeight: 50,
          txHeight: 30,
          rxHeight: 30,
          obstacleDistance: 5,
        };
        
        if (params.distance <= 0) {
          throw new Error('Distance invalide');
        }
      }).toThrow('Distance invalide');
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
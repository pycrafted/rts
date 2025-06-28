/**
 * Service de calcul du bilan de liaison
 * 
 * Ce service gère les calculs de bilan de liaison pour :
 * - Les liaisons hertziennes
 * - Les liaisons optiques
 * 
 * Il prend en compte :
 * - Les pertes en espace libre
 * - Les pertes atmosphériques
 * - Les pertes de polarisation
 * - Les pertes de désalignement
 * - Les gains d'antenne
 */

/**
 * Interface définissant les paramètres du bilan de liaison
 */
export interface LinkBudgetParams {
  frequency: number; // MHz
  distance: number; // mètres
  txPower: number; // dBm
  txGain: number; // dBi
  rxGain: number; // dBi
  txHeight: number; // mètres
  rxHeight: number; // mètres
  climate: 'temperate' | 'tropical' | 'arid';
  reliability: number; // %
  diffractionLoss?: number; // Optional diffraction loss in dB
  polarizationLoss?: number;
  misalignmentLoss?: number;
}

/**
 * Interface définissant les résultats du bilan de liaison
 */
export interface LinkBudgetResult {
  freeSpaceLoss: number;
  atmosphericLoss: number;
  totalLoss: number;
  totalGain: number;
  receivedPower: number;
  systemMargin: number;
  availability: number;
}

export interface FresnelZoneParams {
  frequency: number; // MHz
  distance: number; // mètres
  obstacleHeight?: number; // mètres
  obstacleDistance?: number; // mètres depuis l'émetteur
}

export interface FresnelZoneResult {
  radius: number; // mètres
  clearance: number; // mètres
  clearancePercentage: number; // %
}

export interface DiffractionParams {
  frequency: number; // MHz
  distance: number; // mètres
  obstacleHeight: number; // mètres
  obstacleDistance: number; // mètres depuis l'émetteur
  txHeight: number; // mètres
  rxHeight: number; // mètres
  obstacles?: Array<{
    height: number;
    distance: number;
  }>;
}

export interface DiffractionResult {
  loss: number; // dB
  totalLoss?: number; // dB pour obstacles multiples
  clearance: number; // mètres
  clearancePercentage: number; // %
}

interface Point2D {
  x: number;
  y: number;
}

export class LinkBudgetService {
  private static readonly C = 299792458; // Vitesse de la lumière en m/s

  /**
   * Calcule la perte en espace libre (formule de Friis)
   */
  private static calculateFreeSpaceLoss(frequency: number, distance: number): number {
    const wavelength = this.C / (frequency * 1e6); // Conversion MHz en Hz
    return 20 * Math.log10(4 * Math.PI * distance / wavelength);
  }

  /**
   * Calcule le rayon de la première zone de Fresnel
   */
  private static calculateFirstFresnelRadius(frequency: number, d1: number, d2: number): number {
    const wavelength = this.C / (frequency * 1e6);
    return Math.sqrt(wavelength * d1 * d2 / (d1 + d2));
  }

  /**
   * Calcule les points de l'ellipsoïde de Fresnel
   */
  public static calculateFresnelPoints(frequency: number, distance: number): Point2D[] {
    const points: Point2D[] = [];
    const numPoints = 100;

    for (let i = 0; i <= numPoints; i++) {
      const x = (distance * i) / numPoints;
      const d1 = x;
      const d2 = distance - x;
      const radius = this.calculateFirstFresnelRadius(frequency, d1, d2);
      
      points.push({ x, y: radius });
    }

    return points;
  }

  /**
   * Calcule le bilan de liaison complet
   */
  public static calculateLinkBudget(params: LinkBudgetParams): LinkBudgetResult {
    const {
      frequency,
      distance,
      txPower,
      txGain,
      rxGain,
      climate,
      reliability,
      diffractionLoss = 0,
      polarizationLoss = 0.5,
      misalignmentLoss = 0.5
    } = params;

    // Perte en espace libre
    const freeSpaceLoss = this.calculateFreeSpaceLoss(frequency, distance);

    // Pertes atmosphériques (simplifiées)
    const atmosphericLoss = this.calculateAtmosphericLoss(distance, climate);

    // Pertes totales (incluant les pertes par diffraction, polarisation et désalignement)
    const totalLoss = freeSpaceLoss + atmosphericLoss + polarizationLoss + misalignmentLoss + diffractionLoss;

    // Gains totaux
    const totalGain = txGain + rxGain;

    // Puissance reçue
    const receivedPower = txPower + totalGain - totalLoss;

    // Marge système (sensibilité du récepteur à -70 dBm)
    const systemMargin = receivedPower - (-70);

    // Disponibilité (basée sur la marge système et la fiabilité requise)
    const availability = this.calculateAvailability(systemMargin, reliability);

    return {
      freeSpaceLoss,
      atmosphericLoss,
      totalLoss,
      totalGain,
      receivedPower,
      systemMargin,
      availability
    };
  }

  /**
   * Calcule les pertes atmosphériques
   */
  private static calculateAtmosphericLoss(distance: number, climate: string): number {
    const baseLoss = 0.1; // dB/km
    switch (climate) {
      case 'tropical':
        return baseLoss * 1.5 * (distance / 1000);
      case 'arid':
        return baseLoss * 0.8 * (distance / 1000);
      default:
        return baseLoss * (distance / 1000);
    }
  }

  /**
   * Calcule la disponibilité du lien
   */
  private static calculateAvailability(systemMargin: number, reliability: number): number {
    // Formule simplifiée basée sur la marge système
    const baseAvailability = 99.9;
    const marginFactor = Math.min(systemMargin / 20, 1);
    return baseAvailability + (marginFactor * (reliability - baseAvailability));
  }

  // Calcul de la marge de fade (méthode de Barnett-Vignant)
  static calculateFadeMargin(params: {
    frequency: number;
    distance: number;
    climate: string;
    reliability: number;
  }): number {
    const { frequency, distance, climate, reliability } = params;
    
    // Facteurs climatiques
    const climateFactors = {
      'dry': 1,
      'normal': 2,
      'humid': 3
    };

    const factor = climateFactors[climate as keyof typeof climateFactors] || 2;
    const freqGHz = frequency / 1000;

    // Formule de Barnett-Vignant
    return factor * Math.pow(freqGHz, 0.5) * Math.pow(distance, 1.5) * (1 - reliability / 100);
  }
}

// Fonctions exportées pour les tests
export function calculateLinkBudget(params: LinkBudgetParams): LinkBudgetResult {
  return LinkBudgetService.calculateLinkBudget(params);
}

export function calculateFresnelZone(params: FresnelZoneParams): FresnelZoneResult {
  const { frequency, distance, obstacleHeight = 0, obstacleDistance = distance / 2 } = params;
  
  const d1 = obstacleDistance;
  const d2 = distance - obstacleDistance;
  const radius = LinkBudgetService['calculateFirstFresnelRadius'](frequency, d1, d2);
  
  // Calcul du dégagement
  const clearance = radius - obstacleHeight;
  const clearancePercentage = (clearance / radius) * 100;
  
  return {
    radius,
    clearance: Math.max(0, clearance),
    clearancePercentage: Math.max(0, clearancePercentage)
  };
}

export function calculateDiffractionLoss(params: DiffractionParams): DiffractionResult {
  const { frequency, distance, obstacleHeight, obstacleDistance, txHeight, rxHeight, obstacles } = params;
  
  // Si pas d'obstacles multiples, calcul simple
  if (!obstacles || obstacles.length === 0) {
    const fresnelResult = calculateFresnelZone({
      frequency,
      distance,
      obstacleHeight,
      obstacleDistance
    });
    
    // Si l'obstacle est sous la ligne de vue, pas de perte
    if (fresnelResult.clearance >= 0) {
      return {
        loss: 0,
        clearance: fresnelResult.clearance,
        clearancePercentage: fresnelResult.clearancePercentage
      };
    }
    
    // Calcul de la perte par diffraction selon le modèle ITU-R
    const h = Math.abs(fresnelResult.clearance);
    const wavelength = 299792458 / (frequency * 1e6);
    const d1 = obstacleDistance;
    const d2 = distance - obstacleDistance;
    
    // Paramètre de diffraction
    const v = h * Math.sqrt(2 * (d1 + d2) / (wavelength * d1 * d2));
    
    // Perte par diffraction (formule simplifiée)
    let loss = 0;
    if (v > 0) {
      loss = 6.9 + 20 * Math.log10(Math.sqrt(Math.pow(v - 0.1, 2) + 1) + v - 0.1);
    }
    
    return {
      loss: Math.max(0, loss),
      clearance: fresnelResult.clearance,
      clearancePercentage: fresnelResult.clearancePercentage
    };
  }
  
  // Calcul pour obstacles multiples
  let totalLoss = 0;
  let minClearance = Infinity;
  
  for (const obstacle of obstacles) {
    const result = calculateDiffractionLoss({
      frequency,
      distance,
      obstacleHeight: obstacle.height,
      obstacleDistance: obstacle.distance,
      txHeight,
      rxHeight
    });
    
    totalLoss += result.loss;
    minClearance = Math.min(minClearance, result.clearance);
  }
  
  return {
    loss: 0, // Perte individuelle (non utilisée pour obstacles multiples)
    totalLoss,
    clearance: Math.max(0, minClearance),
    clearancePercentage: minClearance > 0 ? 100 : 0
  };
} 
interface Obstacle {
  position: [number, number, number];
  height: number;
  width: number;
}

interface DiffractionParams {
  frequency: number;
  distance: number;
  txPosition: [number, number, number];
  rxPosition: [number, number, number];
  obstacles: Obstacle[];
}

interface DiffractionResult {
  totalLoss: number;
  obstacleLosses: Array<{
    obstacle: Obstacle;
    loss: number;
  }>;
}

/**
 * Service de calcul des pertes par diffraction pour les liaisons hertziennes
 * Implémente les formules de Fresnel-Kirchhoff pour la diffraction
 * @see https://en.wikipedia.org/wiki/Fresnel_diffraction
 */
export class DiffractionService {
  private static readonly C = 299792458; // Vitesse de la lumière en m/s
  private static readonly MIN_DISTANCE = 0.1; // Distance minimale en mètres
  private static readonly MAX_DISTANCE = 100000; // Distance maximale en mètres (100km)
  private static readonly MIN_FREQUENCY = 100; // Fréquence minimale en MHz
  private static readonly MAX_FREQUENCY = 100000; // Fréquence maximale en MHz (100GHz)

  /**
   * Vérifie la validité des paramètres de diffraction
   * @throws Error si les paramètres sont invalides
   */
  private static validateParams(params: DiffractionParams): void {
    if (params.frequency < this.MIN_FREQUENCY || params.frequency > this.MAX_FREQUENCY) {
      throw new Error(`Fréquence invalide: ${params.frequency} MHz. Doit être entre ${this.MIN_FREQUENCY} et ${this.MAX_FREQUENCY} MHz`);
    }

    const distance = Math.sqrt(
      Math.pow(params.rxPosition[0] - params.txPosition[0], 2) +
      Math.pow(params.rxPosition[2] - params.txPosition[2], 2)
    );

    if (distance < this.MIN_DISTANCE || distance > this.MAX_DISTANCE) {
      throw new Error(`Distance invalide: ${distance} m. Doit être entre ${this.MIN_DISTANCE} et ${this.MAX_DISTANCE} m`);
    }

    if (params.obstacles.some(obs => obs.height < 0)) {
      throw new Error('La hauteur des obstacles ne peut pas être négative');
    }
  }

  /**
   * Calcule le paramètre de diffraction v selon la théorie de Fresnel
   * Formule: v = h_eff * sqrt(2 * (d1 + d2) / (λ * d1 * d2))
   * où h_eff est la hauteur effective de l'obstacle au-dessus de la ligne de visée
   * @param h Hauteur de l'obstacle en mètres
   * @param wavelength Longueur d'onde en mètres
   * @param d1 Distance de l'émetteur à l'obstacle en mètres
   * @param d2 Distance de l'obstacle au récepteur en mètres
   * @returns Paramètre de diffraction v (sans unité)
   */
  private static calculateDiffractionParameter(
    h: number,
    wavelength: number,
    d1: number,
    d2: number
  ): number {
    // Calcul de la hauteur effective en tenant compte de la courbure de la Terre
    const h_eff = h - (d1 * d2) / (2 * (d1 + d2));
    return h_eff * Math.sqrt(2 * (d1 + d2) / (wavelength * d1 * d2));
  }

  /**
   * Calcule la perte par diffraction en dB selon la formule de Fresnel-Kirchhoff
   * @param v Paramètre de diffraction
   * @returns Perte en dB
   */
  private static calculateDiffractionLoss(v: number): number {
    // Formule de Fresnel-Kirchhoff pour la diffraction
    if (v < -0.7) {
      return 0; // Obstacle bien en dessous de la ligne de visée
    } else if (v < 0) {
      return 0; // Obstacle légèrement en dessous de la ligne de visée
    } else if (v < 1) {
      // Zone de transition (0 < v < 1)
      return 6 + 9 * v;
    } else if (v < 2.4) {
      // Zone de diffraction principale (1 < v < 2.4)
      return 13 + 20 * Math.log10(v);
    } else {
      // Zone de diffraction secondaire (v > 2.4)
      return 20 + 20 * Math.log10(v);
    }
  }

  /**
   * Calcule la perte par diffraction pour un obstacle
   * @param obstacle Obstacle à analyser
   * @param params Paramètres de la liaison
   * @returns Perte en dB
   */
  private static calculateObstacleLoss(
    obstacle: Obstacle,
    params: DiffractionParams
  ): number {
    const wavelength = this.C / (params.frequency * 1e6); // Conversion MHz en Hz
    const d1 = Math.sqrt(
      Math.pow(obstacle.position[0] - params.txPosition[0], 2) +
      Math.pow(obstacle.position[2] - params.txPosition[2], 2)
    );
    const d2 = Math.sqrt(
      Math.pow(params.rxPosition[0] - obstacle.position[0], 2) +
      Math.pow(params.rxPosition[2] - obstacle.position[2], 2)
    );

    const v = this.calculateDiffractionParameter(
      obstacle.height,
      wavelength,
      d1,
      d2
    );

    return this.calculateDiffractionLoss(v);
  }

  /**
   * Calcule la perte totale par diffraction pour tous les obstacles
   * en utilisant la méthode de Epstein-Peterson pour les pertes multiples
   * @param params Paramètres de la liaison
   * @returns Résultat contenant la perte totale et le détail par obstacle
   * @throws Error si les paramètres sont invalides
   */
  public static calculateTotalDiffractionLoss(
    params: DiffractionParams
  ): DiffractionResult {
    // Validation des paramètres
    this.validateParams(params);

    // Trier les obstacles par distance à l'émetteur
    const sortedObstacles = [...params.obstacles].sort((a, b) => {
      const d1a = Math.sqrt(
        Math.pow(a.position[0] - params.txPosition[0], 2) +
        Math.pow(a.position[2] - params.txPosition[2], 2)
      );
      const d1b = Math.sqrt(
        Math.pow(b.position[0] - params.txPosition[0], 2) +
        Math.pow(b.position[2] - params.txPosition[2], 2)
      );
      return d1a - d1b;
    });

    let totalLoss = 0;
    const obstacleLosses = [];

    // Calculer les pertes pour chaque obstacle
    for (let i = 0; i < sortedObstacles.length; i++) {
      const obstacle = sortedObstacles[i];
      const loss = this.calculateObstacleLoss(obstacle, params);
      
      // Appliquer un facteur de correction pour les pertes multiples
      // Le premier obstacle a un impact plus important
      const correctionFactor = i === 0 ? 1 : 0.5;
      const correctedLoss = loss * correctionFactor;
      
      totalLoss += correctedLoss;
      obstacleLosses.push({
        obstacle,
        loss: correctedLoss
      });
    }

    return {
      totalLoss,
      obstacleLosses
    };
  }

  /**
   * Vérifie si un obstacle est dans la première zone de Fresnel
   * @param obstacle Obstacle à vérifier
   * @param params Paramètres de la liaison
   * @returns true si l'obstacle est dans la première zone de Fresnel
   */
  public static isInFirstFresnelZone(
    obstacle: Obstacle,
    params: DiffractionParams
  ): boolean {
    const wavelength = this.C / (params.frequency * 1e6);
    const d1 = Math.sqrt(
      Math.pow(obstacle.position[0] - params.txPosition[0], 2) +
      Math.pow(obstacle.position[2] - params.txPosition[2], 2)
    );
    const d2 = Math.sqrt(
      Math.pow(params.rxPosition[0] - obstacle.position[0], 2) +
      Math.pow(params.rxPosition[2] - obstacle.position[2], 2)
    );

    // Calcul du rayon de la première zone de Fresnel
    const fresnelRadius = Math.sqrt(wavelength * d1 * d2 / (d1 + d2));
    return obstacle.height <= fresnelRadius;
  }
} 
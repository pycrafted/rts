// Service pour gérer les communications avec le Web Worker
class WorkerService {
  private worker: Worker | null = null;
  private messageQueue: Map<string, { resolve: Function; reject: Function }> = new Map();
  private isReady = false;

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    try {
      this.worker = new Worker('/workers/calculations.js');
      
      this.worker.onmessage = (event) => {
        const { id, type, result, error } = event.data;
        
        if (type === 'WORKER_READY') {
          this.isReady = true;
          console.log('Worker Service: Calculations worker ready');
          return;
        }
        
        const pendingMessage = this.messageQueue.get(id);
        if (pendingMessage) {
          this.messageQueue.delete(id);
          
          if (type === 'SUCCESS') {
            pendingMessage.resolve(result);
          } else if (type === 'ERROR') {
            pendingMessage.reject(new Error(error));
          }
        }
      };
      
      this.worker.onerror = (error) => {
        console.error('Worker Service: Worker error', error);
        this.isReady = false;
      };
      
    } catch (error) {
      console.error('Worker Service: Failed to initialize worker', error);
      this.isReady = false;
    }
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendMessage(type: string, data: any): Promise<any> {
    if (!this.worker || !this.isReady) {
      throw new Error('Worker not ready');
    }

    return new Promise((resolve, reject) => {
      const id = this.generateId();
      
      this.messageQueue.set(id, { resolve, reject });
      
      this.worker!.postMessage({
        id,
        type,
        data
      });
      
      // Timeout pour éviter les blocages
      setTimeout(() => {
        if (this.messageQueue.has(id)) {
          this.messageQueue.delete(id);
          reject(new Error('Worker timeout'));
        }
      }, 10000); // 10 secondes de timeout
    });
  }

  // Calcul de diffraction
  async calculateDiffraction(params: {
    frequency: number;
    distance: number;
    obstacleHeight: number;
    txHeight: number;
    rxHeight: number;
  }) {
    try {
      return await this.sendMessage('DIFFRACTION', params);
    } catch (error) {
      console.error('Worker Service: Diffraction calculation failed', error);
      // Fallback vers le calcul local si le worker échoue
      return this.fallbackDiffractionCalculation(params);
    }
  }

  // Calcul de bilan de liaison
  async calculateLinkBudget(params: {
    frequency: number;
    distance: number;
    txPower: number;
    txGain: number;
    rxGain: number;
    txHeight: number;
    rxHeight: number;
    climate?: string;
    reliability?: number;
    diffractionLoss?: number;
    polarizationLoss?: number;
    misalignmentLoss?: number;
  }) {
    try {
      return await this.sendMessage('LINK_BUDGET', params);
    } catch (error) {
      console.error('Worker Service: Link budget calculation failed', error);
      // Fallback vers le calcul local
      return this.fallbackLinkBudgetCalculation(params);
    }
  }

  // Calculs GSM
  async calculateGSM(params: {
    subscribers: number;
    trafficPerSubscriber: number;
    blockingProbability: number;
    numberOfChannels: number;
  }) {
    try {
      return await this.sendMessage('GSM', params);
    } catch (error) {
      console.error('Worker Service: GSM calculation failed', error);
      return this.fallbackGSMCalculation(params);
    }
  }

  // Calculs UMTS
  async calculateUMTS(params: {
    numberOfUsers: number;
    dataRatePerUser: number;
    activityFactor: number;
    serviceType: string;
    nodeBTransmitPower: number;
  }) {
    try {
      return await this.sendMessage('UMTS', params);
    } catch (error) {
      console.error('Worker Service: UMTS calculation failed', error);
      return this.fallbackUMTSCalculation(params);
    }
  }

  // Nettoyer le cache du worker
  async clearCache() {
    try {
      return await this.sendMessage('CLEAR_CACHE', {});
    } catch (error) {
      console.error('Worker Service: Clear cache failed', error);
    }
  }

  // Méthodes de fallback (calculs locaux)
  private fallbackDiffractionCalculation(params: any) {
    const { frequency, distance, obstacleHeight, txHeight, rxHeight } = params;
    const wavelength = 300000 / frequency;
    const d1 = Math.sqrt((txHeight - obstacleHeight) ** 2 + (distance / 2) ** 2);
    const d2 = Math.sqrt((rxHeight - obstacleHeight) ** 2 + (distance / 2) ** 2);
    
    const h = Math.sqrt((2 * wavelength * d1 * d2) / (d1 + d2));
    const v = obstacleHeight / h;
    
    let loss = 0;
    if (v > -0.8) {
      loss = 6.9 + 20 * Math.log10(Math.sqrt((v - 0.1) ** 2 + 1) + v - 0.1);
    }
    
    return { loss, v, h, wavelength };
  }

  private fallbackLinkBudgetCalculation(params: any) {
    const { frequency, distance, txPower, txGain, rxGain } = params;
    const wavelength = 300000 / frequency;
    const freeSpaceLoss = 20 * Math.log10((4 * Math.PI * distance * 1000) / wavelength);
    const rxLevel = txPower + txGain + rxGain - freeSpaceLoss;
    
    return {
      rxLevel,
      freeSpaceLoss,
      atmosphericLoss: 0,
      fadeMargin: rxLevel - (-85),
      availability: 99.9
    };
  }

  private fallbackGSMCalculation(params: any) {
    const { subscribers, trafficPerSubscriber, numberOfChannels } = params;
    const totalTraffic = subscribers * trafficPerSubscriber;
    
    return {
      totalTraffic,
      requiredChannels: Math.ceil(totalTraffic * 1.2),
      numberOfTRX: Math.ceil(totalTraffic / 8),
      utilization: (totalTraffic / numberOfChannels) * 100
    };
  }

  private fallbackUMTSCalculation(params: any) {
    const { numberOfUsers, dataRatePerUser, activityFactor } = params;
    const totalDataRate = numberOfUsers * dataRatePerUser * activityFactor;
    const loadFactor = Math.min(0.8, totalDataRate / 2048);
    
    return {
      loadFactor,
      qosLevel: loadFactor < 0.3 ? 'excellent' : 'good',
      numberOfNodeBs: Math.ceil(numberOfUsers / 100),
      totalDataRate,
      coverageArea: Math.ceil(numberOfUsers / 100) * 16
    };
  }

  // Vérifier si le worker est prêt
  isWorkerReady(): boolean {
    return this.isReady;
  }

  // Redémarrer le worker
  restart() {
    if (this.worker) {
      this.worker.terminate();
    }
    this.messageQueue.clear();
    this.isReady = false;
    this.initWorker();
  }

  // Nettoyer les ressources
  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.messageQueue.clear();
    this.isReady = false;
  }
}

// Instance singleton
export const workerService = new WorkerService();

// Hook React pour utiliser le service
export const useWorkerService = () => {
  return {
    calculateDiffraction: workerService.calculateDiffraction.bind(workerService),
    calculateLinkBudget: workerService.calculateLinkBudget.bind(workerService),
    calculateGSM: workerService.calculateGSM.bind(workerService),
    calculateUMTS: workerService.calculateUMTS.bind(workerService),
    clearCache: workerService.clearCache.bind(workerService),
    isReady: workerService.isWorkerReady.bind(workerService),
    restart: workerService.restart.bind(workerService)
  };
}; 
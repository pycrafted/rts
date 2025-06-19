// Web Worker pour les calculs lourds - RTS-Tutor

// Cache pour les calculs répétitifs
const calculationCache = new Map();
const MAX_CACHE_SIZE = 1000;

// Fonction utilitaire pour nettoyer le cache
function cleanupCache() {
  if (calculationCache.size > MAX_CACHE_SIZE) {
    const firstKey = calculationCache.keys().next().value;
    if (firstKey) {
      calculationCache.delete(firstKey);
    }
  }
}

// Calcul de diffraction (algorithme de Fresnel)
function calculateDiffraction(frequency, distance, obstacleHeight, txHeight, rxHeight) {
  const cacheKey = `diffraction_${frequency}_${distance}_${obstacleHeight}_${txHeight}_${rxHeight}`;
  
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey);
  }

  const wavelength = 300000 / frequency; // MHz to m
  const d1 = Math.sqrt((txHeight - obstacleHeight) ** 2 + (distance / 2) ** 2);
  const d2 = Math.sqrt((rxHeight - obstacleHeight) ** 2 + (distance / 2) ** 2);
  
  const h = Math.sqrt((2 * wavelength * d1 * d2) / (d1 + d2));
  const v = obstacleHeight / h;
  
  let loss = 0;
  if (v > -0.8) {
    loss = 6.9 + 20 * Math.log10(Math.sqrt((v - 0.1) ** 2 + 1) + v - 0.1);
  }
  
  const result = { loss, v, h, wavelength };
  calculationCache.set(cacheKey, result);
  cleanupCache();
  
  return result;
}

// Calcul de bilan de liaison
function calculateLinkBudget(params) {
  const cacheKey = `linkbudget_${JSON.stringify(params)}`;
  
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey);
  }

  const {
    frequency,
    distance,
    txPower,
    txGain,
    rxGain,
    txHeight,
    rxHeight,
    climate = 'temperate',
    reliability = 99.9,
    diffractionLoss = 0,
    polarizationLoss = 0.3,
    misalignmentLoss = 0.5
  } = params;

  // Calcul des pertes de propagation
  const wavelength = 300000 / frequency;
  const freeSpaceLoss = 20 * Math.log10((4 * Math.PI * distance * 1000) / wavelength);
  
  // Facteur de climat
  const climateFactors = {
    'temperate': 1.0,
    'tropical': 1.2,
    'desert': 0.8,
    'arctic': 0.9
  };
  
  const climateFactor = climateFactors[climate] || 1.0;
  const atmosphericLoss = distance * climateFactor * 0.1;
  
  // Calcul du niveau de réception
  const rxLevel = txPower + txGain + rxGain - freeSpaceLoss - atmosphericLoss - 
                 diffractionLoss - polarizationLoss - misalignmentLoss;
  
  // Marge de fade
  const fadeMargin = rxLevel - (-85); // Seuil de réception typique
  
  const result = {
    rxLevel,
    freeSpaceLoss,
    atmosphericLoss,
    fadeMargin,
    availability: calculateAvailability(fadeMargin, reliability)
  };
  
  calculationCache.set(cacheKey, result);
  cleanupCache();
  
  return result;
}

// Calcul de disponibilité
function calculateAvailability(fadeMargin, reliability) {
  const availability = Math.min(99.999, 100 - (100 - reliability) * Math.exp(-fadeMargin / 10));
  return availability;
}

// Calculs GSM
function calculateGSM(params) {
  const cacheKey = `gsm_${JSON.stringify(params)}`;
  
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey);
  }

  const {
    subscribers,
    trafficPerSubscriber,
    blockingProbability,
    numberOfChannels
  } = params;

  // Calcul du trafic total
  const totalTraffic = subscribers * trafficPerSubscriber;
  
  // Calcul du nombre de canaux nécessaires (formule d'Erlang-B)
  const requiredChannels = calculateErlangB(totalTraffic, blockingProbability);
  
  // Calcul du nombre de TRX
  const trxPerChannel = 8; // GSM standard
  const numberOfTRX = Math.ceil(requiredChannels / trxPerChannel);
  
  const result = {
    totalTraffic,
    requiredChannels,
    numberOfTRX,
    utilization: (totalTraffic / numberOfChannels) * 100
  };
  
  calculationCache.set(cacheKey, result);
  cleanupCache();
  
  return result;
}

// Formule d'Erlang-B (approximation)
function calculateErlangB(traffic, blocking) {
  // Approximation simplifiée
  const blockingDecimal = blocking / 100;
  const channels = Math.ceil(traffic / (1 - blockingDecimal));
  return Math.max(channels, 1);
}

// Calculs UMTS
function calculateUMTS(params) {
  const cacheKey = `umts_${JSON.stringify(params)}`;
  
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey);
  }

  const {
    numberOfUsers,
    dataRatePerUser,
    activityFactor,
    serviceType,
    nodeBTransmitPower
  } = params;

  // Calcul du facteur de charge
  const totalDataRate = numberOfUsers * dataRatePerUser * activityFactor;
  const maxDataRate = 2048; // 2 Mbps typique pour UMTS
  
  const loadFactor = Math.min(0.8, totalDataRate / maxDataRate);
  
  // Calcul de la QoS
  const qosLevel = calculateQoS(loadFactor, numberOfUsers);
  
  // Calcul du nombre de NodeB nécessaires
  const usersPerNodeB = Math.floor(100 / loadFactor);
  const numberOfNodeBs = Math.ceil(numberOfUsers / usersPerNodeB);
  
  const result = {
    loadFactor,
    qosLevel,
    numberOfNodeBs,
    totalDataRate,
    coverageArea: numberOfNodeBs * 16 // km² par NodeB
  };
  
  calculationCache.set(cacheKey, result);
  cleanupCache();
  
  return result;
}

// Calcul de la QoS
function calculateQoS(loadFactor, userCount) {
  if (loadFactor < 0.3) return 'excellent';
  if (loadFactor < 0.6) return 'good';
  if (loadFactor < 0.8) return 'fair';
  return 'poor';
}

// Écouteur de messages
self.addEventListener('message', (event) => {
  const { type, data, id } = event.data;
  
  try {
    let result;
    
    switch (type) {
      case 'DIFFRACTION':
        result = calculateDiffraction(
          data.frequency,
          data.distance,
          data.obstacleHeight,
          data.txHeight,
          data.rxHeight
        );
        break;
        
      case 'LINK_BUDGET':
        result = calculateLinkBudget(data);
        break;
        
      case 'GSM':
        result = calculateGSM(data);
        break;
        
      case 'UMTS':
        result = calculateUMTS(data);
        break;
        
      case 'CLEAR_CACHE':
        calculationCache.clear();
        result = { success: true, message: 'Cache cleared' };
        break;
        
      default:
        throw new Error(`Unknown calculation type: ${type}`);
    }
    
    // Réponse avec l'ID pour associer la réponse à la requête
    self.postMessage({
      id,
      type: 'SUCCESS',
      result
    });
    
  } catch (error) {
    self.postMessage({
      id,
      type: 'ERROR',
      error: error.message
    });
  }
});

// Notification de démarrage
self.postMessage({
  type: 'WORKER_READY',
  message: 'Calculations worker ready'
});

console.log('Calculations Worker: Loaded'); 
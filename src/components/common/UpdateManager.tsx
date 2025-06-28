import React, { useState, useEffect } from 'react';
import { useUpdateService } from '@/services/updateService';

interface UpdateManagerProps {
  className?: string;
}

export const UpdateManager: React.FC<UpdateManagerProps> = ({ className = '' }) => {
  const [updateStatus, setUpdateStatus] = useState<string>('');
  const [updateInfo, setUpdateInfo] = useState<any>(null);
  const [progress, setProgress] = useState<number>(0);
  
  const {
    checkForUpdates,
    downloadUpdate,
    installUpdate,
    on,
    off,
    getAppVersion,
    getPlatform,
    isElectron
  } = useUpdateService();

  useEffect(() => {
    if (!isElectron()) return;

    // Écouter les événements de mise à jour
    const handleUpdateStatus = (data: any) => {
      setUpdateStatus(data.message);
      if (data.info) {
        setUpdateInfo(data.info);
      }
    };

    const handleUpdateProgress = (data: any) => {
      if (data.progress) {
        setProgress(data.progress.percent || 0);
      }
    };

    on('checking', handleUpdateStatus);
    on('available', handleUpdateStatus);
    on('not-available', handleUpdateStatus);
    on('downloaded', handleUpdateStatus);
    on('error', handleUpdateStatus);
    on('progress', handleUpdateProgress);

    // Nettoyer les listeners
    return () => {
      off('checking', handleUpdateStatus);
      off('available', handleUpdateStatus);
      off('not-available', handleUpdateStatus);
      off('downloaded', handleUpdateStatus);
      off('error', handleUpdateStatus);
      off('progress', handleUpdateProgress);
    };
  }, [on, off, isElectron]);

  const handleCheckForUpdates = async () => {
    setUpdateStatus('Vérification en cours...');
    try {
      await checkForUpdates();
    } catch (error) {
      setUpdateStatus('Erreur lors de la vérification');
    }
  };

  const handleDownloadUpdate = async () => {
    setUpdateStatus('Téléchargement en cours...');
    try {
      await downloadUpdate();
    } catch (error) {
      setUpdateStatus('Erreur lors du téléchargement');
    }
  };

  const handleInstallUpdate = async () => {
    setUpdateStatus('Installation en cours...');
    try {
      await installUpdate();
    } catch (error) {
      setUpdateStatus('Erreur lors de l\'installation');
    }
  };

  if (!isElectron()) {
    return null; // Ne pas afficher en mode web
  }

  return (
    <div className={className}>
      {/* Bouton de vérification des mises à jour */}
      <button
        onClick={handleCheckForUpdates}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        title="Vérifier les mises à jour"
      >
        🔄 Vérifier les mises à jour
      </button>

      {/* Affichage du statut */}
      {updateStatus && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
          {updateStatus}
        </div>
      )}

      {/* Barre de progression */}
      {progress > 0 && progress < 100 && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {progress.toFixed(1)}%
          </div>
        </div>
      )}

      {/* Actions de mise à jour */}
      {updateInfo && updateStatus.includes('disponible') && (
        <div className="mt-2 space-y-2">
          <button
            onClick={handleDownloadUpdate}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
          >
            📥 Télécharger la mise à jour
          </button>
          <div className="text-xs text-gray-600">
            Version {updateInfo.version}
          </div>
        </div>
      )}

      {updateStatus.includes('téléchargée') && (
        <div className="mt-2">
          <button
            onClick={handleInstallUpdate}
            className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors"
          >
            🔄 Installer et redémarrer
          </button>
        </div>
      )}

      {/* Informations de version */}
      <div className="mt-4 text-xs text-gray-500">
        Version {getAppVersion()} - {getPlatform()}
      </div>
    </div>
  );
};

export default UpdateManager; 
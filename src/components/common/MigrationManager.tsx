// Composant de gestion de la migration au démarrage
// Suivant le guide de migration MIGRATION_DESKTOP.md

import React, { useEffect, useState } from 'react';
import { useMigrationService } from '../../services/migrationService';
import { useDesktopStorage } from '../../services/desktopStorage';
import { useElectron } from '../../services/electronService';

interface MigrationState {
  isChecking: boolean;
  isMigrating: boolean;
  isComplete: boolean;
  error: string | null;
  progress: number;
  currentStep: string;
}

export const MigrationManager: React.FC = () => {
  const [migrationState, setMigrationState] = useState<MigrationState>({
    isChecking: false,
    isMigrating: false,
    isComplete: false,
    error: null,
    progress: 0,
    currentStep: ''
  });

  const migrationService = useMigrationService();
  const desktopStorage = useDesktopStorage();
  const electronService = useElectron();

  useEffect(() => {
    const performMigration = async () => {
      try {
        console.log('🔍 MigrationManager: Début de la migration');
        console.log('🔍 MigrationManager: electronService.isAvailable =', electronService.isAvailable);
        console.log('🔍 MigrationManager: electronService.environment =', electronService.environment);
        
        setMigrationState(prev => ({ ...prev, isChecking: true, currentStep: 'Vérification de l\'environnement...' }));

        // Vérifier si on est en mode Electron
        const isElectronEnv = electronService.isAvailable;
        
        if (!isElectronEnv) {
          console.log('🌐 MigrationManager: Mode web détecté, migration non nécessaire');
          setMigrationState(prev => ({ ...prev, isComplete: true, isChecking: false }));
          return;
        }

        console.log('⚡ MigrationManager: Mode Electron détecté, début de la migration');
        setMigrationState(prev => ({ ...prev, progress: 20, currentStep: 'Vérification du statut de migration...' }));

        // Vérifier si c'est la première exécution
        console.log('🔍 MigrationManager: Vérification isFirstRun...');
        const isFirstRun = await migrationService.isFirstRun();
        console.log('🔍 MigrationManager: isFirstRun =', isFirstRun);
        
        if (!isFirstRun) {
          console.log('🔍 MigrationManager: Migration déjà effectuée, validation de l\'intégrité...');
          setMigrationState(prev => ({ ...prev, progress: 40, currentStep: 'Validation de l\'intégrité des données...' }));
          
          // Vérifier l'intégrité des données existantes
          const validation = await migrationService.validateMigratedData();
          console.log('🔍 MigrationManager: Validation =', validation);
          
          if (validation.valid) {
            console.log('✅ MigrationManager: Migration déjà effectuée et données valides');
            setMigrationState(prev => ({ 
              ...prev, 
              isComplete: true, 
              isChecking: false,
              progress: 100,
              currentStep: 'Migration déjà effectuée'
            }));
            return;
          } else {
            console.warn('⚠️ MigrationManager: Problèmes d\'intégrité détectés:', validation.errors);
            setMigrationState(prev => ({ 
              ...prev, 
              progress: 50, 
              currentStep: 'Problèmes d\'intégrité détectés, nouvelle migration nécessaire...'
            }));
          }
        }

        console.log('🔄 MigrationManager: Début de la migration complète...');
        setMigrationState(prev => ({ 
          ...prev, 
          isMigrating: true, 
          isChecking: false,
          progress: 60,
          currentStep: 'Création de la sauvegarde pré-migration...'
        }));

        // Créer une sauvegarde avant migration
        console.log('💾 MigrationManager: Création de la sauvegarde...');
        await migrationService.createPreMigrationBackup();

        setMigrationState(prev => ({ 
          ...prev, 
          progress: 70,
          currentStep: 'Migration des données depuis localStorage...'
        }));

        // Effectuer la migration complète
        console.log('🔄 MigrationManager: Exécution de la migration complète...');
        const result = await migrationService.performCompleteMigration();
        console.log('🔍 MigrationManager: Résultat de la migration =', result);

        if (result.success) {
          console.log('✅ MigrationManager: Migration terminée avec succès');
          setMigrationState(prev => ({ 
            ...prev, 
            isComplete: true, 
            isMigrating: false,
            progress: 100,
            currentStep: `Migration réussie: ${result.migratedKeys.length} clés migrées`
          }));
        } else {
          console.error('❌ MigrationManager: Échec de la migration:', result.errors);
          setMigrationState(prev => ({ 
            ...prev, 
            error: `Erreur lors de la migration: ${result.errors.join(', ')}`,
            isMigrating: false,
            currentStep: 'Échec de la migration'
          }));
        }

      } catch (error) {
        console.error('💥 MigrationManager: Erreur inattendue:', error);
        setMigrationState(prev => ({ 
          ...prev, 
          error: `Erreur inattendue: ${error}`,
          isMigrating: false,
          isChecking: false,
          currentStep: 'Erreur inattendue'
        }));
      }
    };

    performMigration();
  }, [migrationService, desktopStorage, electronService]);

  // Debug: Afficher l'état actuel
  console.log('🔍 MigrationManager: État actuel =', migrationState);

  // Si la migration est terminée ou qu'il n'y a pas d'erreur, ne rien afficher
  if (migrationState.isComplete && !migrationState.error) {
    console.log('✅ MigrationManager: Migration terminée, masquage du composant');
    return null;
  }

  // Si on est en mode web, ne rien afficher
  if (!electronService.isAvailable) {
    console.log('🌐 MigrationManager: Mode web, masquage du composant');
    return null;
  }

  console.log('🔄 MigrationManager: Affichage du modal de migration');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto mb-4">
              {migrationState.isMigrating ? (
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              ) : (
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {migrationState.error ? 'Erreur de migration' : 'Migration des données'}
            </h2>
            
            <p className="text-sm text-gray-600 mb-4">
              {migrationState.currentStep}
            </p>
          </div>

          {/* Barre de progression */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${migrationState.progress}%` }}
            ></div>
          </div>

          {/* Messages d'erreur */}
          {migrationState.error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-sm text-red-800">{migrationState.error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center space-x-3">
            {migrationState.error && (
              <>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Réessayer
                </button>
                <button
                  onClick={() => setMigrationState(prev => ({ ...prev, error: null, isComplete: true }))}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Continuer quand même
                </button>
              </>
            )}
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-4 text-xs text-gray-500">
            <p>Cette migration est nécessaire pour passer de localStorage à electron-store</p>
            <p>Vos données existantes sont sauvegardées automatiquement</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MigrationManager; 
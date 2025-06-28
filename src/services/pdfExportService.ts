/**
 * Service d'export PDF avec Puppeteer
 * Permet d'exporter des rapports complets avec graphiques en PDF
 */

import { ElectronService } from './electronService';

export interface PDFExportData {
  type: 'gsm' | 'umts' | 'hertzien' | 'optique' | 'complete';
  title: string;
  subtitle?: string;
  data: any;
  user?: string;
}

export interface PDFExportResult {
  success: boolean;
  filePath?: string;
  error?: string;
  metadata?: {
    size: number;
    pages: number;
    generatedAt: string;
  };
}

export class PDFExportService {
  private static instance: PDFExportService;
  private electronService: ElectronService;

  private constructor() {
    this.electronService = ElectronService.getInstance();
  }

  public static getInstance(): PDFExportService {
    if (!PDFExportService.instance) {
      PDFExportService.instance = new PDFExportService();
    }
    return PDFExportService.instance;
  }

  /**
   * Exporte un rapport complet en PDF avec graphiques
   */
  public async exportCompleteReport(data: PDFExportData): Promise<PDFExportResult> {
    try {
      if (!this.electronService.isAvailable()) {
        return {
          success: false,
          error: 'Export PDF non disponible en mode web. Utilisez l\'application desktop.'
        };
      }

      console.log('📊 Préparation de l\'export PDF...', data);

      const result = await this.electronService.exportPDF(data);

      if (result.success) {
        console.log('✅ Export PDF réussi:', result.filePath);
        return {
          success: true,
          filePath: result.filePath,
          metadata: (result as any).metadata || {
            size: 0,
            pages: 1,
            generatedAt: new Date().toISOString()
          }
        };
      } else {
        console.error('❌ Échec de l\'export PDF:', result.error);
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'export PDF:', error);
      return {
        success: false,
        error: `Erreur lors de l'export PDF: ${error}`
      };
    }
  }

  /**
   * Exporte un rapport GSM
   */
  public async exportGsmReport(gsmData: any): Promise<PDFExportResult> {
    const reportData: PDFExportData = {
      type: 'gsm',
      title: 'Rapport de Dimensionnement GSM',
      subtitle: 'Analyse complète du réseau GSM',
      data: gsmData,
      user: 'Ingénieur Télécoms'
    };

    return await this.exportCompleteReport(reportData);
  }

  /**
   * Exporte un rapport UMTS
   */
  public async exportUmtsReport(umtsData: any): Promise<PDFExportResult> {
    const reportData: PDFExportData = {
      type: 'umts',
      title: 'Rapport de Dimensionnement UMTS',
      subtitle: 'Analyse complète du réseau UMTS/WCDMA',
      data: umtsData,
      user: 'Ingénieur Télécoms'
    };

    return await this.exportCompleteReport(reportData);
  }

  /**
   * Exporte un rapport Hertzien
   */
  public async exportHertzienReport(hertzienData: any): Promise<PDFExportResult> {
    const reportData: PDFExportData = {
      type: 'hertzien',
      title: 'Rapport de Dimensionnement Hertzien',
      subtitle: 'Liaison radio point à point - Analyse complète',
      data: hertzienData,
      user: 'Ingénieur Télécoms'
    };

    return await this.exportCompleteReport(reportData);
  }

  /**
   * Exporte un rapport Optique
   */
  public async exportOptiqueReport(optiqueData: any): Promise<PDFExportResult> {
    const reportData: PDFExportData = {
      type: 'optique',
      title: 'Rapport de Dimensionnement Optique',
      subtitle: 'Liaison fibre optique - Analyse complète',
      data: optiqueData,
      user: 'Ingénieur Télécoms'
    };

    return await this.exportCompleteReport(reportData);
  }

  /**
   * Exporte un rapport complet avec toutes les données
   */
  public async exportDashboardReport(allData: any): Promise<PDFExportResult> {
    const reportData: PDFExportData = {
      type: 'complete',
      title: 'Rapport Complet RTS',
      subtitle: 'Dashboard complet - Toutes les technologies',
      data: allData,
      user: 'Ingénieur Télécoms'
    };

    return await this.exportCompleteReport(reportData);
  }
}

// Hook React pour utiliser le service
export const usePDFExport = () => {
  const pdfService = PDFExportService.getInstance();
  
  return {
    exportCompleteReport: pdfService.exportCompleteReport.bind(pdfService),
    exportGsmReport: pdfService.exportGsmReport.bind(pdfService),
    exportUmtsReport: pdfService.exportUmtsReport.bind(pdfService),
    exportHertzienReport: pdfService.exportHertzienReport.bind(pdfService),
    exportOptiqueReport: pdfService.exportOptiqueReport.bind(pdfService),
    exportDashboardReport: pdfService.exportDashboardReport.bind(pdfService)
  };
}; 
import { useState, useEffect, useCallback } from 'react'

export type Language = 'en' | 'pt-BR'

const translations: Record<Language, Record<string, string>> = {
  'en': {
    // Navigation
    'nav.home': 'Home',
    'nav.museum': 'Museum',
    'nav.simulator': 'Vision Simulator',
    'nav.search': 'Search',
    'nav.genes': 'Genes',
    'nav.trials': 'Clinical Trials',
    'nav.analytics': 'Analytics',
    'nav.admin': 'Admin',
    'nav.cloudflare': 'Cloudflare Dashboard',
    'nav.healthData': 'Health Data Management',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.search': 'Search',
    'common.close': 'Close',

    // Accessibility
    'a11y.highContrast': 'Toggle High Contrast',
    'a11y.highContrastOn': '☀️ Normal',
    'a11y.highContrastOff': '🌓 High Contrast',
    'a11y.skipToContent': 'Skip to main content',
    'a11y.menuOpen': 'Menu opened',
    'a11y.menuClosed': 'Menu closed',

    // Dashboard
    'dashboard.title': 'Cloudflare Dashboard',
    'dashboard.resources': 'Resources',
    'dashboard.metrics': 'Metrics',
    'dashboard.logs': 'Recent Logs',
    'dashboard.configuration': 'Configuration',
    'dashboard.status': 'Status',
    'dashboard.active': 'Active',
    'dashboard.inactive': 'Inactive',
    'dashboard.error': 'Error',

    // Health Data
    'health.title': 'Health Data Management',
    'health.subtitle': 'Manage clinical records with semantic vector search for retinal dystrophies',
    'health.crud': 'CRUD Records',
    'health.search': 'Vector Search',
    'health.newRecord': 'New Record',
    'health.editRecord': 'Edit Record',
    'health.patientId': 'Patient ID',
    'health.condition': 'Condition / Gene',
    'health.geneMarker': 'Gene Marker',
    'health.visionLoss': 'Vision Loss (%)',
    'health.retinalThickness': 'Retinal Thickness (mm)',
    'health.notes': 'Clinical Notes',
    'health.existingRecords': 'Existing Records',
    'health.semanticSearch': 'Semantic Vector Search',
    'health.searchPlaceholder': 'E.g., "Night vision loss with CDHR1" or "Reduced retinal thickness"',
    'health.searchResults': 'Semantic Results',
    'health.similarity': 'Similarity',
    'health.recordCreated': 'Record created successfully!',
    'health.recordUpdated': 'Record updated successfully!',
    'health.recordDeleted': 'Record deleted successfully!',

    // Simulator
    'simulator.title': 'Vision Simulator',
    'simulator.subtitle': 'Visualize the progression of retinal dystrophy over time',
    'simulator.year': 'Year',
    'simulator.ercThickness': 'Retinal Thickness (ERC)',
    'simulator.degradation': 'Degradation Rate',
    'simulator.visualField': 'Visual Field Remaining',
    'simulator.normalVision': 'Normal Vision',
    'simulator.nightSymptoms': 'Night Symptoms',
    'simulator.peripheralLoss': 'Peripheral Loss',
    'simulator.significantLoss': 'Significant Loss',
    'simulator.tubularVision': 'Tubular Vision',

    // Admin
    'admin.title': 'Management Panel',
    'admin.subtitle': 'Register new information and upload documents to the knowledge base',
    'admin.newArticle': 'Register New Article',
    'admin.uploadDocuments': 'Upload Documents (R2)',
    'admin.pmid': 'PMID',
    'admin.title_field': 'Article Title',
    'admin.abstract': 'Abstract',
    'admin.authors': 'Authors',
    'admin.journal': 'Journal',
    'admin.year': 'Year',
    'admin.url': 'Article URL',
    'admin.register': 'Register and Generate AI',
    'admin.processing': 'Processing...',
  },
  'pt-BR': {
    // Navigation
    'nav.home': 'Início',
    'nav.museum': 'Museu',
    'nav.simulator': 'Simulador de Visão',
    'nav.search': 'Busca',
    'nav.genes': 'Genes',
    'nav.trials': 'Ensaios Clínicos',
    'nav.analytics': 'Analytics',
    'nav.admin': 'Admin',
    'nav.cloudflare': 'Dashboard Cloudflare',
    'nav.healthData': 'Gestão de Dados de Saúde',

    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Deletar',
    'common.edit': 'Editar',
    'common.create': 'Criar',
    'common.search': 'Buscar',
    'common.close': 'Fechar',

    // Accessibility
    'a11y.highContrast': 'Alternar Alto Contraste',
    'a11y.highContrastOn': '☀️ Normal',
    'a11y.highContrastOff': '🌓 Alto Contraste',
    'a11y.skipToContent': 'Pular para conteúdo principal',
    'a11y.menuOpen': 'Menu aberto',
    'a11y.menuClosed': 'Menu fechado',

    // Dashboard
    'dashboard.title': 'Dashboard Cloudflare',
    'dashboard.resources': 'Recursos',
    'dashboard.metrics': 'Métricas',
    'dashboard.logs': 'Logs Recentes',
    'dashboard.configuration': 'Configurações',
    'dashboard.status': 'Status',
    'dashboard.active': 'Ativo',
    'dashboard.inactive': 'Inativo',
    'dashboard.error': 'Erro',

    // Health Data
    'health.title': 'Gestão de Dados de Saúde',
    'health.subtitle': 'Gerencie registros clínicos com busca semântica vetorial para distrofias retinianas',
    'health.crud': 'CRUD de Registros',
    'health.search': 'Busca Vetorial',
    'health.newRecord': 'Novo Registro',
    'health.editRecord': 'Editar Registro',
    'health.patientId': 'ID do Paciente',
    'health.condition': 'Condição / Gene',
    'health.geneMarker': 'Marcador Genético',
    'health.visionLoss': 'Perda de Visão (%)',
    'health.retinalThickness': 'Espessura Retiniana (mm)',
    'health.notes': 'Notas Clínicas',
    'health.existingRecords': 'Registros Existentes',
    'health.semanticSearch': 'Busca Semântica Vetorial',
    'health.searchPlaceholder': 'Ex: "Perda de visão noturna com CDHR1" ou "Espessura retiniana reduzida"',
    'health.searchResults': 'Resultados Semânticos',
    'health.similarity': 'Similaridade',
    'health.recordCreated': 'Registro criado com sucesso!',
    'health.recordUpdated': 'Registro atualizado com sucesso!',
    'health.recordDeleted': 'Registro deletado com sucesso!',

    // Simulator
    'simulator.title': 'Simulador de Visão',
    'simulator.subtitle': 'Visualize a progressão da distrofia retiniana ao longo do tempo',
    'simulator.year': 'Ano',
    'simulator.ercThickness': 'Espessura Retiniana (ERC)',
    'simulator.degradation': 'Taxa de Degradação',
    'simulator.visualField': 'Campo Visual Restante',
    'simulator.normalVision': 'Visão Normal',
    'simulator.nightSymptoms': 'Sintomas Noturnos',
    'simulator.peripheralLoss': 'Redução Periférica',
    'simulator.significantLoss': 'Perda Significativa',
    'simulator.tubularVision': 'Visão Tubular',

    // Admin
    'admin.title': 'Painel de Gerenciamento',
    'admin.subtitle': 'Cadastre novas informações e faça upload de documentos para a base de conhecimento',
    'admin.newArticle': 'Cadastrar Novo Artigo',
    'admin.uploadDocuments': 'Upload de Documentos (R2)',
    'admin.pmid': 'PMID',
    'admin.title_field': 'Título do Artigo',
    'admin.abstract': 'Resumo / Abstract',
    'admin.authors': 'Autores',
    'admin.journal': 'Revista / Journal',
    'admin.year': 'Ano',
    'admin.url': 'URL do Artigo',
    'admin.register': 'Cadastrar e Gerar IA',
    'admin.processing': 'Processando...',
  }
}

const STORAGE_KEY = 'language'
const DEFAULT_LANGUAGE: Language = 'en'

export function useI18n() {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'pt-BR') {
      return stored
    }
    return DEFAULT_LANGUAGE
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const t = useCallback((key: string): string => {
    return translations[language][key] || key
  }, [language])

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'pt-BR' : 'en')
  }, [])

  return { language, t, toggleLanguage }
}

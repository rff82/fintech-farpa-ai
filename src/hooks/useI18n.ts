import { useState, useEffect, useCallback } from 'react'

export type Language = 'en' | 'pt-BR'

const translations: Record<Language, Record<string, string>> = {
  'en': {
    // Navigation
    'nav.home': 'Home',
    'nav.museum': 'Financial Museum',
    'nav.simulator': 'Market Simulator',
    'nav.search': 'Search',
    'nav.genes': 'Assets',
    'nav.trials': 'Market Trends',
    'nav.analytics': 'Analytics',
    'nav.admin': 'Admin',
    'nav.cloudflare': 'Cloudflare Dashboard',
    'nav.healthData': 'Financial Data Management',

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

    // Financial Data
    'health.title': 'Financial Data Management',
    'health.subtitle': 'Manage financial records with semantic vector search for market intelligence',
    'health.crud': 'CRUD Records',
    'health.search': 'Vector Search',
    'health.newRecord': 'New Record',
    'health.editRecord': 'Edit Record',
    'health.patientId': 'Client ID',
    'health.condition': 'Asset / Sector',
    'health.geneMarker': 'Market Ticker',
    'health.visionLoss': 'Risk Level (%)',
    'health.retinalThickness': 'Asset Value (USD)',
    'health.notes': 'Financial Notes',
    'health.existingRecords': 'Existing Records',
    'health.semanticSearch': 'Semantic Vector Search',
    'health.searchPlaceholder': 'E.g., "High risk assets in tech" or "Market volatility trends"',
    'health.searchResults': 'Semantic Results',
    'health.similarity': 'Similarity',
    'health.recordCreated': 'Record created successfully!',
    'health.recordUpdated': 'Record updated successfully!',
    'health.recordDeleted': 'Record deleted successfully!',

    // Simulator
    'simulator.title': 'Market Simulator',
    'simulator.subtitle': 'Visualize the progression of financial assets over time',
    'simulator.year': 'Year',
    'simulator.ercThickness': 'Asset Value (USD)',
    'simulator.degradation': 'Volatility Rate',
    'simulator.visualField': 'Portfolio Remaining',
    'simulator.normalVision': 'Stable Market',
    'simulator.nightSymptoms': 'Bear Market',
    'simulator.peripheralLoss': 'Market Correction',
    'simulator.significantLoss': 'Significant Loss',
    'simulator.tubularVision': 'Market Crash',

    // Admin
    'admin.title': 'Management Panel',
    'admin.subtitle': 'Register new information and upload documents to the knowledge base',
    'admin.newArticle': 'Register New Report',
    'admin.uploadDocuments': 'Upload Documents (R2)',
    'admin.pmid': 'Report ID',
    'admin.title_field': 'Report Title',
    'admin.abstract': 'Executive Summary',
    'admin.authors': 'Analysts',
    'admin.journal': 'Source / Institution',
    'admin.year': 'Year',
    'admin.url': 'Report URL',
    'admin.register': 'Register and Generate AI',
    'admin.processing': 'Processing...',
  },
  'pt-BR': {
    // Navigation
    'nav.home': 'Início',
    'nav.museum': 'Museu Financeiro',
    'nav.simulator': 'Simulador de Mercado',
    'nav.search': 'Busca',
    'nav.genes': 'Ativos',
    'nav.trials': 'Tendências de Mercado',
    'nav.analytics': 'Analytics',
    'nav.admin': 'Admin',
    'nav.cloudflare': 'Dashboard Cloudflare',
    'nav.healthData': 'Gestão de Dados Financeiros',

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

    // Financial Data
    'health.title': 'Gestão de Dados Financeiros',
    'health.subtitle': 'Gerencie registros financeiros com busca semântica vetorial para inteligência de mercado',
    'health.crud': 'CRUD de Registros',
    'health.search': 'Busca Vetorial',
    'health.newRecord': 'Novo Registro',
    'health.editRecord': 'Editar Registro',
    'health.patientId': 'ID do Cliente',
    'health.condition': 'Ativo / Setor',
    'health.geneMarker': 'Ticker de Mercado',
    'health.visionLoss': 'Nível de Risco (%)',
    'health.retinalThickness': 'Valor do Ativo (USD)',
    'health.notes': 'Notas Financeiras',
    'health.existingRecords': 'Registros Existentes',
    'health.semanticSearch': 'Busca Semântica Vetorial',
    'health.searchPlaceholder': 'Ex: "Ativos de alto risco em tecnologia" ou "Tendências de volatilidade"',
    'health.searchResults': 'Resultados Semânticos',
    'health.similarity': 'Similaridade',
    'health.recordCreated': 'Registro criado com sucesso!',
    'health.recordUpdated': 'Registro atualizado com sucesso!',
    'health.recordDeleted': 'Registro deletado com sucesso!',

    // Simulator
    'simulator.title': 'Simulador de Mercado',
    'simulator.subtitle': 'Visualize a progressão de ativos financeiros ao longo do tempo',
    'simulator.year': 'Ano',
    'simulator.ercThickness': 'Valor do Ativo (USD)',
    'simulator.degradation': 'Taxa de Volatilidade',
    'simulator.visualField': 'Portfólio Restante',
    'simulator.normalVision': 'Mercado Estável',
    'simulator.nightSymptoms': 'Mercado em Queda',
    'simulator.peripheralLoss': 'Correção de Mercado',
    'simulator.significantLoss': 'Perda Significativa',
    'simulator.tubularVision': 'Crash de Mercado',

    // Admin
    'admin.title': 'Painel de Gerenciamento',
    'admin.subtitle': 'Cadastre novas informações e faça upload de documentos para a base de conhecimento',
    'admin.newArticle': 'Cadastrar Novo Relatório',
    'admin.uploadDocuments': 'Upload de Documentos (R2)',
    'admin.pmid': 'ID do Relatório',
    'admin.title_field': 'Título do Relatório',
    'admin.abstract': 'Resumo Executivo',
    'admin.authors': 'Analistas',
    'admin.journal': 'Fonte / Instituição',
    'admin.year': 'Ano',
    'admin.url': 'URL do Relatório',
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

const CT_BASE = 'https://clinicaltrials.gov/api/v2/studies'
const CACHE_TTL = 172800 // 48h

export interface ClinicalTrialResult {
  nctId: string
  title: string
  status: string
  phase: string
  sponsor: string
  locations: string[]
  startDate: string
  url: string
}

interface CTStudy {
  protocolSection: {
    identificationModule: { nctId: string; briefTitle: string }
    statusModule: {
      overallStatus: string
      startDateStruct?: { date: string }
    }
    designModule?: { phases?: string[] }
    sponsorCollaboratorsModule?: { leadSponsor?: { name: string } }
    contactsLocationsModule?: {
      locations?: Array<{ city?: string; country?: string }>
    }
  }
}

export async function searchClinicalTrials(
  query: string,
  kv: KVNamespace,
): Promise<ClinicalTrialResult[]> {
  const cacheKey = `trials:${query.toLowerCase().trim()}`
  const cached = await kv.get(cacheKey)
  if (cached) return JSON.parse(cached) as ClinicalTrialResult[]

  const url =
    `${CT_BASE}?query.term=${encodeURIComponent(query)}&pageSize=20&format=json`
  const res = await fetch(url)
  if (!res.ok) return []

  const data = (await res.json()) as { studies?: CTStudy[] }
  const studies = data.studies ?? []

  const results: ClinicalTrialResult[] = studies.map(s => {
    const pm = s.protocolSection
    return {
      nctId: pm.identificationModule.nctId,
      title: pm.identificationModule.briefTitle,
      status: pm.statusModule.overallStatus,
      phase: pm.designModule?.phases?.[0] ?? 'N/A',
      sponsor: pm.sponsorCollaboratorsModule?.leadSponsor?.name ?? '',
      locations: (pm.contactsLocationsModule?.locations ?? [])
        .slice(0, 3)
        .map(l => [l.city, l.country].filter(Boolean).join(', ')),
      startDate: pm.statusModule.startDateStruct?.date ?? '',
      url: `https://clinicaltrials.gov/study/${pm.identificationModule.nctId}`,
    }
  })

  await kv.put(cacheKey, JSON.stringify(results), { expirationTtl: CACHE_TTL })
  return results
}

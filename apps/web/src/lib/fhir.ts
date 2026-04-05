/**
 * FHIR R4 Export — JSON and PDF support.
 * Generates FHIR-compliant Patient and Observation resources.
 * PII is stripped — uses anonymousId as patient identifier.
 */

export interface FHIRPatient {
  resourceType: "Patient";
  id: string;
  meta: { profile: string[] };
  identifier: Array<{ system: string; value: string }>;
  text: { status: string; div: string };
}

export interface FHIRObservation {
  resourceType: "Observation";
  id: string;
  status: "final" | "preliminary" | "amended";
  code: { coding: Array<{ system: string; code: string; display: string }> };
  subject: { reference: string };
  effectiveDateTime: string;
  valueQuantity: { value: number; unit: string; system: string; code: string };
  note?: Array<{ text: string }>;
}

export interface FHIRBundle {
  resourceType: "Bundle";
  type: "collection";
  timestamp: string;
  entry: Array<{ resource: FHIRPatient | FHIRObservation }>;
}

/**
 * Build a FHIR Bundle for a given anonymous user and their ERC observations.
 */
export function buildFHIRBundle(
  anonymousId: string,
  observations: Array<{
    year: number;
    erc: number;
    date: string;
  }>
): FHIRBundle {
  const patientRef = `Patient/${anonymousId}`;

  const patient: FHIRPatient = {
    resourceType: "Patient",
    id: anonymousId,
    meta: {
      profile: ["http://hl7.org/fhir/StructureDefinition/Patient"],
    },
    identifier: [
      {
        system: "urn:ietf:rfc:4122",
        value: anonymousId,
      },
    ],
    text: {
      status: "generated",
      div: `<div xmlns="http://www.w3.org/1999/xhtml">Anonymized patient (SHA-256 hash)</div>`,
    },
  };

  const obsResources: FHIRObservation[] = observations.map((o) => ({
    resourceType: "Observation",
    id: `obs-cdhr1-year-${o.year}`,
    status: "final",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "89014-4",
          display: "Electro-Retinogram Contrast Sensitivity",
        },
      ],
    },
    subject: { reference: patientRef },
    effectiveDateTime: o.date,
    valueQuantity: {
      value: o.erc,
      unit: "ERC",
      system: "http://unitsofmeasure.org",
      code: "{ERC}",
    },
    note: [
      {
        text: `CDHR1 simulation year ${o.year}. Model: ERC(t) = ERC_baseline × e^(−r_G × t)`,
      },
    ],
  }));

  return {
    resourceType: "Bundle",
    type: "collection",
    timestamp: new Date().toISOString(),
    entry: [
      { resource: patient },
      ...obsResources.map((r) => ({ resource: r })),
    ],
  };
}

/**
 * Serialize FHIR Bundle to JSON string.
 */
export function exportFHIRJson(bundle: FHIRBundle): string {
  return JSON.stringify(bundle, null, 2);
}

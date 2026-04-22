/**
 * KPS SOAP Client
 * Calls NVI's TCKimlikNoDogrula web service.
 *
 * IMPORTANT: This endpoint only returns true/false — it does NOT return
 * personal record details. It confirms whether the combination of
 * TC + Ad + Soyad + DogumYili exists in the civil registry.
 *
 * NVI endpoint: https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx
 * WSDL:         https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL
 *
 * Access requirements:
 *   - Your server's static IP must be whitelisted by NVI
 *   - Institutional agreement with NVI required
 *   - Only available to authorized entities (banks, insurance, public bodies)
 */

const KPS_ENDPOINT = process.env.KPS_ENDPOINT || 'https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx';
const KPS_TIMEOUT_MS = parseInt(process.env.KPS_TIMEOUT_MS || '8000', 10);

/**
 * @param {{ tc: string, ad: string, soyad: string, dogumYili: number }} params
 * @returns {Promise<{ verified: boolean }>}
 */
export async function callKPS({ tc, ad, soyad, dogumYili }) {
  const soapBody = buildSoapEnvelope({ tc, ad, soyad, dogumYili });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), KPS_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(KPS_ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': '"http://tckimlik.nvi.gov.tr/Service/TCKimlikNoDogrula"',
        'Content-Length': Buffer.byteLength(soapBody).toString(),
      },
      body: soapBody,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`KPS HTTP ${response.status}: ${response.statusText}`);
  }

  const xml = await response.text();
  return parseKPSResponse(xml);
}

// ── SOAP envelope builder ─────────────────────────────────────────────────────
function buildSoapEnvelope({ tc, ad, soyad, dogumYili }) {
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Body>
    <TCKimlikNoDogrula xmlns="http://tckimlik.nvi.gov.tr/Service">
      <TCKimlikNo>${escapeXml(tc)}</TCKimlikNo>
      <Ad>${escapeXml(ad)}</Ad>
      <Soyad>${escapeXml(soyad)}</Soyad>
      <DogumYili>${dogumYili}</DogumYili>
    </TCKimlikNoDogrula>
  </soap:Body>
</soap:Envelope>`;
}

// ── Response parser ───────────────────────────────────────────────────────────
function parseKPSResponse(xml) {
  // NVI returns: <TCKimlikNoDogrulaResult>true</TCKimlikNoDogrulaResult>
  const match = xml.match(/<TCKimlikNoDogrulaResult[^>]*>(true|false)<\/TCKimlikNoDogrulaResult>/i);
  if (!match) {
    // Check for SOAP fault
    if (xml.includes('<faultstring>')) {
      const fault = xml.match(/<faultstring>(.*?)<\/faultstring>/)?.[1] || 'Bilinmeyen SOAP hatası';
      throw new Error(`KPS SOAP Fault: ${fault}`);
    }
    throw new Error('KPS yanıtı beklenmeyen formatta.');
  }
  return { verified: match[1].toLowerCase() === 'true' };
}

// ── XML escape ────────────────────────────────────────────────────────────────
function escapeXml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&apos;');
}

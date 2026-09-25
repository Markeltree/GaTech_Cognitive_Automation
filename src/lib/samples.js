export const SAMPLE_DOCS = [
  {
    label: 'Vendor invoice',
    text: `ACME CORP — Cloud Services
1200 Harbor Blvd, Austin, TX 78701

INVOICE  INV-2026-0418
Date: September 2, 2026        Due: October 2, 2026 (Net 30)
Bill to: Northwind Logistics LLC, 88 Pier St, Oakland CA
PO Reference: PO-77120

Description                              Qty     Amount
Managed Kubernetes cluster (3 nodes)     1 mo    $14,200.00
Premium support SLA                      1 mo     $5,800.00
Data egress overage                      1.2 TB   $2,400.00

Subtotal                                         $22,400.00
Sales tax 8.25%                                   $1,848.00
TOTAL DUE                                        $24,248.00

Remit to: First National Bank, Acct ****4471`,
  },
  {
    label: 'Services contract',
    text: `MASTER SERVICES AGREEMENT

This Agreement is entered into as of January 15, 2026 between Acme Corp ("Provider") and Northwind Logistics LLC ("Client").

1. Term. Thirty-six (36) months from the Effective Date. Automatically renews for successive one-year terms unless either party gives sixty (60) days written notice.
2. Fees. Client shall pay $1,240,000 over the Term, invoiced quarterly. Provider may adjust renewal pricing at its discretion.
3. Liability. Each party's aggregate liability is capped at fees paid in the prior twelve (12) months.
4. Governing Law. State of Delaware.

Signed for Provider: ______ J. Alvarez, CEO
Signed for Client: ______`,
  },
  {
    label: 'Customer complaint',
    text: `From: maria.chen@brightwell.io
Subject: Order #48213 — second failed delivery

Hi team, this is the second time my order #48213 hasn't arrived. The tracking said delivered last Tuesday but nothing came. I've been a customer for 4 years and this is really frustrating. I need this resolved this week or I'd like a full refund of $1,380.

Maria Chen, Operations Lead, Brightwell`,
  },
];

export const SAMPLE_DECISIONS = [
  {
    label: 'Credit limit increase',
    domain: 'finance',
    scenario: `Customer Brightwell Inc. requests a credit limit increase from $50,000 to $150,000.
- Customer for 4 years, annual spend $420k and growing 30% YoY
- Two payments were 12 and 19 days late in the last 12 months
- Latest financials unverified; customer says a Series B closed last month
- Sales says the increase unlocks a $600k annual contract`,
    policy: 'Increases above 2x require CFO sign-off unless risk score < 40.',
  },
  {
    label: 'Refund exception',
    domain: 'customer service',
    scenario: `Customer requests a full refund of $1,380 for order #48213, 45 days after purchase (policy allows 30 days).
- Two failed deliveries confirmed by carrier
- Customer lifetime value: $18,400 over 4 years
- No previous refund requests`,
    policy: 'Refunds after 30 days need manager approval. Retention of high-LTV customers is a Q3 priority.',
  },
  {
    label: 'New vendor onboarding',
    domain: 'procurement',
    scenario: `Onboard DataPipe Ltd. as a data-processing subcontractor for EU customer records.
- Quote is 22% below incumbent
- ISO 27001 certified; SOC 2 report pending (expected in 60 days)
- Hosting in Frankfurt; no prior incidents found
- 12-month contract, $210k`,
    policy: 'Vendors processing personal data must have SOC 2 or equivalent before go-live.',
  },
];

export const SAMPLE_MESSAGES = [
  { label: 'Angry customer', channel: 'email', text: SAMPLE_DOCS[2].text },
  { label: 'Sales lead', channel: 'chat', text: 'Hey! We’re a 300-person logistics company looking at automating invoice processing. Could we get a demo next week and rough pricing for ~20k invoices/month?' },
  { label: 'Spanish support ticket', channel: 'ticket', text: 'Hola, desde ayer no puedo acceder al panel de facturación. Me aparece un error 403 y tengo que enviar los informes al cierre de mes el viernes. ¿Pueden ayudarme urgente?' },
];

export const SAMPLE_SERIES = [
  { label: 'Invoice volume', metric: 'Monthly invoices processed', unit: 'invoices', series: [3120, 3340, 3290, 3610, 3880, 3950, 4210, 4390, 4302, 4680, 4810, 5020], context: 'B2B logistics client, onboarding two new regions in Q4.' },
  { label: 'Support tickets', metric: 'Weekly support tickets', unit: 'tickets', series: [880, 910, 870, 940, 1010, 990, 1100, 1180, 1150, 1240], context: 'Ticket spike expected after pricing change.' },
  { label: 'Churned accounts', metric: 'Monthly churned accounts', unit: 'accounts', series: [42, 39, 44, 37, 35, 33, 34, 29, 27, 26], context: 'Retention program launched in month 4.' },
];

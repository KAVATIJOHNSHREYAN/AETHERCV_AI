import { NextResponse } from 'next/server'
import { CURRENCY_RATES, COUNTRIES_DATABASE } from '@/lib/salary-predictor/countries-data'
import { COMPANIES_DATABASE } from '@/lib/salary-predictor/companies-data'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'meta'

    if (type === 'currencies') {
      return NextResponse.json({
        success: true,
        currencies: CURRENCY_RATES,
        timestamp: new Date().toISOString()
      })
    }

    if (type === 'companies') {
      return NextResponse.json({
        success: true,
        companies: COMPANIES_DATABASE.map(c => ({
          name: c.name,
          tier: c.tier,
          logoText: c.logoText,
          multiplier: c.compensationMultiplier
        }))
      })
    }

    return NextResponse.json({
      success: true,
      countriesCount: COUNTRIES_DATABASE.length,
      companiesCount: COMPANIES_DATABASE.length,
      currenciesCount: Object.keys(CURRENCY_RATES).length,
      dataSource: 'Global Hiring Market Aggregated Dataset (Q1-Q2 2026)',
      liveStatus: 'Active',
      timestamp: new Date().toISOString()
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export type LeadInfo = {
  phone: string,
  name: string
}

export type DbLeadRes = {
  phone: string,
  name: string,
  created_at: string
}

export type LeadsReq = {
  leads?: [
    {
      id?: string,
      email?: string,
      phone?: string,
      name?: string,
      company?: string,
      job_title?: string,
      bio?: string,
      public_url?: string,
      created_at?: string,
      opportunity?: string,
      number_conversions?: string,
      user?: string,
      first_conversion?: [Object],
      last_conversion?: [Object],
      custom_fields?: unknown,
      website?: string,
      personal_phone?: string,
      mobile_phone?: string,
      city?: string,
      state?: string,
      tags?: string,
      lead_stage?: string,
      last_marked_opportunity_date?: string,
      uuid?: string,
      fit_score?: string,
      interest?: number
    }
  ]
}

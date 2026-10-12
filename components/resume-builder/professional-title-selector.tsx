'use client'

import React from 'react'
import { UniversalJobRoleSelector } from '@/components/shared/universal-job-role-selector'
export { POPULAR_PROFESSIONAL_TITLES } from '@/lib/job-roles/master-library'

interface ProfessionalTitleSelectorProps {
  value: string
  onChange: (title: string) => void
  placeholder?: string
  className?: string
  id?: string
}

export function ProfessionalTitleSelector({
  value,
  onChange,
  placeholder = 'Select or search 200+ job roles, or choose Others to type custom...',
  className = '',
  id = 'professional-title-selector'
}: ProfessionalTitleSelectorProps) {
  return (
    <UniversalJobRoleSelector
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      id={id}
    />
  )
}

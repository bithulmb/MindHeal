import PsychologistListTable from '@/components/admin/PsychologistListTable'
import React from 'react'

const AdminPsychologists = () => {
  return (
    <div>
      <h3 className='text-2xl  font-bold mb-3'>Manage Psychologists</h3>
      <PsychologistListTable/>
    </div>
  )
}

export default AdminPsychologists

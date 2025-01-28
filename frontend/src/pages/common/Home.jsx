import BannerImage from '@/components/common/BannerImage'
import Features from '@/components/common/Features'
import Section1 from '@/components/common/Section1'
import Section2 from '@/components/common/Section2'
import { Separator } from '@/components/ui/separator'
import React from 'react'

const Home = () => {
  return (
    <div>
      <BannerImage/>
      <Section1/>
      <Separator/>
      <Section2/>
      <Separator/>
      <Features/>
      <Separator/>
     
    </div>
  )
}

export default Home

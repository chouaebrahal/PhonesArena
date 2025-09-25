import { Phone } from '@/lib/types'
import React from 'react'
import AnimatedText from './AnimatedText'
 
type SectionHeaderProps = {
   phone:Phone,
   title: string,
}


const SectionHeader = ({phone,title}:SectionHeaderProps)=> {
 const {name,description} = phone;
  return (
    <div className='py-20 flex flex-col items-center'>
        <h2 className="text-3xl  font-bold mb-6"> {title} <AnimatedText text={name} className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-pink-600 bg-clip-text text-transparent pl-1" /> </h2>
        <p className='max-w-4xl flex justify-center text-center text-gray-400 '>{description}</p>
    </div>
  )
}

export default SectionHeader
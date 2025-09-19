import { Category } from '@/lib/types'
import Link from 'next/link'
import React from 'react'

const Categories = ({categories}:{categories:Category[]}) => {
  return (
    <div className='flex flex-wrap gap-3 justify-center px-3 my-5'>{categories.map(cat => {
        return <div  key={cat.id} className='w-fit p-2 mr-1 rounded-2xl text-[16px] font-semibold bg-[var(--primary)] text-white hover:bg-[var(--secondary)] duration-500'><Link href={`blog?category=${cat.slug}`}>{cat.name}</Link>
        </div>
    })}
    </div>
  )
}

export default Categories
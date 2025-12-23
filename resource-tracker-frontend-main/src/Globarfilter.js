import React from 'react'
export  const GlobalFilter = ({ filter, setFilter }) =>
{
    return (    
        <div className=' flex flex-row'> 
        <p className='text-lg pr-1 font-medium'></p>
<span >
    
    <input value={filter || ''} onChange={e => setFilter(e.target.value)} placeholder='Search' className='border-2 border-yellow-400 '/> 
</span>
</div>
    )
}
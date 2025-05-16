import React from 'react'

const CartWrapper = ({shopName, children}) => {
  return (
    <div className='flex flex-col bg-white shadow-md rounded-lg p-4'>  
      <p>{shopName}</p>
      {children}
    </div>
  )
}

export default CartWrapper
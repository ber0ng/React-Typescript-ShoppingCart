import React from 'react'
import { Container } from 'react-bootstrap'

const Footer = () => {
  return (
    <Container style={{bottom: 0, position: 'absolute', width: '100%'}} className='bg-white shadow-sm mb-3'>
        <footer className='py-5'>
            <p>hello</p>
        </footer>
    </Container>
  )
}

export default Footer
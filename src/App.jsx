import React, { useState, useEffect } from 'react'
import BarcodeGenerator from './components/BarcodeGenerator'
import './App.css'

function App() {
  return (
    <div className="App">
      <div className="container">
        <BarcodeGenerator />
      </div>
    </div>
  )
}

export default App


import React, { useState, useEffect } from 'react'
import BarcodeGenerator from './components/BarcodeGenerator'
import './App.css'

function App() {
  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🏪 Supermarket Barcode Generator</h1>
          <p>Generate barcodes for your products with auto-incrementing codes</p>
        </header>
        <BarcodeGenerator />
      </div>
    </div>
  )
}

export default App


import React, { useState, useEffect, useRef } from 'react'
import Barcode from 'react-barcode'
import './BarcodeGenerator.css'

const BarcodeGenerator = () => {
  // Load last barcode from localStorage or start from 1000000000000
  const getInitialBarcode = () => {
    const saved = localStorage.getItem('lastBarcode')
    return saved ? parseInt(saved, 10) : 1000000000000
  }

  const [formData, setFormData] = useState({
    companyName: '',
    productName: '',
    amount: '',
    printQuantity: '1',
  })

  const barcodeSvgRef = useRef(null)
  const [currentBarcode, setCurrentBarcode] = useState(getInitialBarcode())
  const [generatedBarcode, setGeneratedBarcode] = useState(null)
  const [productHistory, setProductHistory] = useState(() => {
    const saved = localStorage.getItem('productHistory')
    return saved ? JSON.parse(saved) : []
  })

  // Save barcode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lastBarcode', currentBarcode.toString())
  }, [currentBarcode])

  // Save product history to localStorage
  useEffect(() => {
    localStorage.setItem('productHistory', JSON.stringify(productHistory))
  }, [productHistory])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGenerate = (e) => {
    e.preventDefault()

    if (!formData.companyName || !formData.productName || !formData.amount) {
      alert('Please fill in all fields')
      return
    }

    const printQty = parseInt(formData.printQuantity) || 1

    const product = {
      id: Date.now(),
      companyName: formData.companyName,
      productName: formData.productName,
      amount: formData.amount,
      barcode: currentBarcode,
      printQuantity: printQty,
      date: new Date().toLocaleString(),
    }

    setGeneratedBarcode(product)
    setProductHistory((prev) => [product, ...prev])

    // Auto-increment barcode for next product
    setCurrentBarcode((prev) => prev + 1)

    // Reset form
    setFormData({
      companyName: formData.companyName, // Keep company name
      productName: '',
      amount: '',
      printQuantity: '1',
    })
  }

  const handlePrint = () => {
    if (!generatedBarcode) return
    
    // Get the SVG from the rendered react-barcode component
    const barcodeSvg = barcodeSvgRef.current?.querySelector('svg')
    if (!barcodeSvg) {
      alert('Barcode not found. Please generate a barcode first.')
      return
    }
    
    // Create a print window with multiple copies
    const printWindow = window.open('', '_blank')
    const quantity = generatedBarcode.printQuantity || 1
    const barcodeSvgHtml = barcodeSvg.outerHTML
    
    let printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Barcodes</title>
          <style>
            @page {
              size: A4;
              margin: 10mm;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .barcode-print-item {
              page-break-inside: avoid;
              margin-bottom: 20px;
              border: 3px solid #000;
              padding: 25px;
              text-align: center;
              background: #fff;
            }
            .barcode-header h3 {
              margin: 10px 0;
              font-size: 24px;
              font-weight: bold;
            }
            .product-name {
              font-size: 18px;
              margin: 8px 0;
              color: #333;
            }
            .product-amount {
              font-size: 22px;
              font-weight: bold;
              color: #000;
              margin: 10px 0;
            }
            .barcode-container {
              margin: 20px 0;
              padding: 20px;
              background: #fff;
              border: 3px solid #000;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .barcode-footer {
              margin-top: 15px;
              font-size: 14px;
              color: #333;
            }
            .barcode-container svg {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
    `
    
    for (let i = 0; i < quantity; i++) {
      printContent += `
        <div class="barcode-print-item">
          <div class="barcode-header">
            <h3>${generatedBarcode.companyName}</h3>
            <p class="product-name">${generatedBarcode.productName}</p>
            <p class="product-amount">$${parseFloat(generatedBarcode.amount).toFixed(2)}</p>
          </div>
          <div class="barcode-container">
            ${barcodeSvgHtml}
          </div>
          <div class="barcode-footer">
            <p><strong>Barcode: ${generatedBarcode.barcode}</strong></p>
          </div>
        </div>
      `
    }
    
    printContent += `
        </body>
      </html>
    `
    
    printWindow.document.write(printContent)
    printWindow.document.close()
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all product history?')) {
      setProductHistory([])
      localStorage.removeItem('productHistory')
    }
  }

  const handleResetBarcode = () => {
    if (window.confirm('Reset barcode counter to 1000000000000?')) {
      setCurrentBarcode(1000000000000)
      localStorage.setItem('lastBarcode', '1000000000000')
    }
  }

  return (
    <div className="barcode-generator">
      <form onSubmit={handleGenerate} className="barcode-form">
        <div className="form-group">
          <label htmlFor="companyName">Company Name *</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="productName">Product Name *</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (Price) *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Enter amount"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="printQuantity">Number of Prints *</label>
          <input
            type="number"
            id="printQuantity"
            name="printQuantity"
            value={formData.printQuantity}
            onChange={handleInputChange}
            placeholder="Enter number of prints"
            min="1"
            max="100"
            required
          />
        </div>

        <div className="barcode-preview">
          <label>Next Barcode:</label>
          <div className="barcode-number">{currentBarcode}</div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Generate Barcode
          </button>
          <button
            type="button"
            onClick={handleResetBarcode}
            className="btn btn-secondary"
          >
            Reset Counter
          </button>
        </div>
      </form>

      {generatedBarcode && (
        <div className="barcode-display print-section">
          <div className="barcode-card">
            <div className="barcode-header">
              <h3>{generatedBarcode.companyName}</h3>
              <p className="product-name">{generatedBarcode.productName}</p>
              <p className="product-amount">${parseFloat(generatedBarcode.amount).toFixed(2)}</p>
            </div>
            <div className="barcode-wrapper zebra-barcode" ref={barcodeSvgRef}>
              {generatedBarcode.barcode && (
                <Barcode
                  value={generatedBarcode.barcode.toString()}
                  format="CODE128"
                  width={3}
                  height={120}
                  displayValue={true}
                  fontSize={18}
                  margin={10}
                  background="#ffffff"
                  lineColor="#000000"
                  renderer="svg"
                />
              )}
            </div>
            <div className="barcode-footer">
              <p>Barcode: {generatedBarcode.barcode}</p>
              <p className="print-quantity-info">Print Quantity: {generatedBarcode.printQuantity}</p>
            </div>
          </div>
          <button onClick={handlePrint} className="btn btn-print">
            🖨️ Print {generatedBarcode.printQuantity} {generatedBarcode.printQuantity === 1 ? 'Copy' : 'Copies'}
          </button>
        </div>
      )}

      {productHistory.length > 0 && (
        <div className="product-history">
          <div className="history-header">
            <h3>Product History</h3>
            <button
              onClick={handleClearHistory}
              className="btn btn-clear"
            >
              Clear History
            </button>
          </div>
          <div className="history-list">
            {productHistory.slice(0, 10).map((product) => (
              <div key={product.id} className="history-item">
                <div className="history-info">
                  <strong>{product.productName}</strong>
                  <span>{product.companyName}</span>
                  <span>${parseFloat(product.amount).toFixed(2)}</span>
                  <span className="history-quantity">Qty: {product.printQuantity || 1}</span>
                </div>
                <div className="history-barcode">{product.barcode}</div>
                <div className="history-date">{product.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BarcodeGenerator


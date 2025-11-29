import React, { useState, useEffect, useRef } from "react";
import Barcode from "react-barcode";
import "./BarcodeGenerator.css";

const BarcodeGenerator = () => {
  // Load last barcode from localStorage or start from 1000000000000
  const getInitialBarcode = () => {
    const saved = localStorage.getItem("lastBarcode");
    return saved ? parseInt(saved, 10) : 1000000000000;
  };

  const [formData, setFormData] = useState({
    companyName: "",
    productName: "",
    amount: "",
    printQuantity: "1",
  });

  const barcodeSvgRef = useRef(null);
  const [currentBarcode, setCurrentBarcode] = useState(getInitialBarcode());
  const [generatedBarcode, setGeneratedBarcode] = useState(null);
  const [productHistory, setProductHistory] = useState(() => {
    const saved = localStorage.getItem("productHistory");
    return saved ? JSON.parse(saved) : [];
  });

  // Save barcode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("lastBarcode", currentBarcode.toString());
  }, [currentBarcode]);

  // Save product history to localStorage
  useEffect(() => {
    localStorage.setItem("productHistory", JSON.stringify(productHistory));
  }, [productHistory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = (e) => {
    e.preventDefault();

    if (!formData.companyName || !formData.productName || !formData.amount) {
      alert("Please fill in all fields");
      return;
    }

    const printQty = parseInt(formData.printQuantity) || 1;

    const product = {
      id: Date.now(),
      companyName: formData.companyName,
      productName: formData.productName,
      amount: formData.amount,
      barcode: currentBarcode,
      printQuantity: printQty,
      date: new Date().toLocaleString(),
    };

    setGeneratedBarcode(product);
    setProductHistory((prev) => [product, ...prev]);

    // Auto-increment barcode for next product
    setCurrentBarcode((prev) => prev + 1);

    // Reset form
    setFormData({
      companyName: formData.companyName, // Keep company name
      productName: "",
      amount: "",
      printQuantity: "1",
    });
  };

  const handlePrint = () => {
    if (!generatedBarcode) return;

    // Get the SVG from the rendered react-barcode component
    const barcodeSvg = barcodeSvgRef.current?.querySelector("svg");
    if (!barcodeSvg) {
      alert("Barcode not found. Please generate a barcode first.");
      return;
    }

    // Create a print window with multiple copies
    const printWindow = window.open("", "_blank");
    const quantity = generatedBarcode.printQuantity || 1;
    const barcodeSvgHtml = barcodeSvg.outerHTML;

    let printContent = `
<!DOCTYPE html>
<html>
  <head>
    <title>Print Barcodes - DT38x25</title>
    <style>
@page {
  size: 38mm 25mm; 
  margin: 0;
}

body {
  margin: 0;
  padding: 0;
  width: 38mm;
  height: 25mm;
  font-family: Arial, sans-serif;
}

.barcode-print-item {
  width: 38mm;
  height: 25mm;
  display: flex;
  flex-direction: column;
  justify-content: center;       /* FULL CENTER vertically */
  align-items: center;           /* FULL CENTER horizontally */
  padding: 0;
  overflow: hidden;
  page-break-after: always;
}

/* COMPANY NAME */
.barcode-header h3 {
  margin: 0;
  font-size: 6pt;                /* Slightly bigger */
  font-weight: bold;
  text-align: center;
  width: 100%;
  line-height: 1.1;
}

/* PRODUCT NAME */
.product-name {
  font-size: 6pt;                /* Bigger and more visible */
  font-weight: 600;
  text-align: center;
  margin: 0.3mm 0 0.3mm 0;
  line-height: 1.1;
}

/* AMOUNT */
.product-amount {
  font-size: 7pt;                /* Slightly bigger */
  font-weight: bold;
  text-align: center;
  margin: 0.3mm 0;
  line-height: 1.1;
}

/* BARCODE */
.barcode-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;           /* Ensures barcode is centered */
  margin-top: 0.5mm;
}

.barcode-container svg {
  width: 95%;                    /* Fit perfectly but not touch sides */
  height: 10mm !important;       /* Taller barcode */
}

    </style>
  </head>
  <body>
`;

    for (let i = 0; i < quantity; i++) {
      printContent += `
    <div class="barcode-print-item">
      <div class="barcode-header">
        <h3>${generatedBarcode.companyName}</h3>
      </div>
      <p class="product-name">${generatedBarcode.productName}</p>
      <p class="product-amount">${parseFloat(generatedBarcode.amount).toFixed(
        2
      )}</p>
      <div class="barcode-container">
        ${barcodeSvgHtml}
      </div>
    </div>
  `;
    }

    printContent += `
  </body>
</html>
`;

    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all product history?")) {
      setProductHistory([]);
      localStorage.removeItem("productHistory");
    }
  };

  const handleResetBarcode = () => {
    if (window.confirm("Reset barcode counter to 1000000000000?")) {
      setCurrentBarcode(1000000000000);
      localStorage.setItem("lastBarcode", "1000000000000");
    }
  };

  const handleBarcodeChange = (e) => {
    const newValue = e.target.value;
    // Only update if it's a valid number
    if (newValue === "" || (!isNaN(newValue) && parseInt(newValue) >= 0)) {
      const barcodeNum = newValue === "" ? 1000000000000 : parseInt(newValue);
      setCurrentBarcode(barcodeNum);
      localStorage.setItem("lastBarcode", barcodeNum.toString());
    }
  };

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
          <label htmlFor="currentBarcode">Current Barcode Number:</label>
          <input
            type="number"
            id="currentBarcode"
            value={currentBarcode}
            onChange={handleBarcodeChange}
            className="barcode-number-input"
            min="0"
            placeholder="Enter barcode number"
          />
          <small className="barcode-hint">
            Next product will use: {currentBarcode + 1}
          </small>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Generate Barcode
          </button>
          <button
            type="button"
            onClick={handleResetBarcode}
            className="btn btn-secondary">
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
              <p className="product-amount">
                ${parseFloat(generatedBarcode.amount).toFixed(2)}
              </p>
            </div>
            <div className="barcode-wrapper zebra-barcode" ref={barcodeSvgRef}>
              {generatedBarcode.barcode && (
                <Barcode
                  value={generatedBarcode.barcode.toString()}
                  format="CODE128"
                  width={2}
                  height={80}
                  displayValue={true}
                  fontSize={12}
                  margin={5}
                  background="#ffffff"
                  lineColor="#000000"
                  renderer="svg"
                />
              )}
            </div>
            <div className="barcode-footer">
              <p>Barcode: {generatedBarcode.barcode}</p>
              <p className="print-quantity-info">
                Print Quantity: {generatedBarcode.printQuantity}
              </p>
            </div>
          </div>
          <button onClick={handlePrint} className="btn btn-print">
            🖨️ Print {generatedBarcode.printQuantity}{" "}
            {generatedBarcode.printQuantity === 1 ? "Copy" : "Copies"}
          </button>
        </div>
      )}

      {productHistory.length > 0 && (
        <div className="product-history">
          <div className="history-header">
            <h3>Product History</h3>
            <button onClick={handleClearHistory} className="btn btn-clear">
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
                  <span className="history-quantity">
                    Qty: {product.printQuantity || 1}
                  </span>
                </div>
                <div className="history-barcode">{product.barcode}</div>
                <div className="history-date">{product.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeGenerator;

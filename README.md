# 🏪 Supermarket Barcode Generator

A modern React-based barcode generator tool for supermarkets. Generate EAN-13 barcodes with auto-incrementing codes for your products.

## Features

- ✅ **Auto-incrementing Barcodes**: Automatically generates the next barcode number for each product
- ✅ **Product Information**: Add company name, product name, and amount/price
- ✅ **Barcode Display**: Visual EAN-13 barcode display
- ✅ **Print Functionality**: Print barcodes directly from the browser
- ✅ **Product History**: View recently generated products
- ✅ **Local Storage**: Saves barcode counter and product history locally
- ✅ **Responsive Design**: Works on desktop and mobile devices

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

3. Fill in the form:
   - **Company Name**: Enter your company/supermarket name
   - **Product Name**: Enter the product name
   - **Amount**: Enter the price/amount

4. Click "Generate Barcode" to create a barcode

5. The barcode will automatically increment for the next product

6. Click "Print Barcode" to print the generated barcode

## Features in Detail

### Auto-Incrementing Barcodes
- Starts from `1000000000000` (EAN-13 format)
- Automatically increments by 1 for each new product
- Counter is saved in browser's local storage
- Use "Reset Counter" button to reset to the starting value

### Product History
- View the last 10 generated products
- Shows company name, product name, amount, barcode, and timestamp
- History is saved in local storage
- Clear history with the "Clear History" button

### Print Functionality
- Click "Print Barcode" to print the current barcode
- Print styles are optimized for barcode labels
- Only the barcode card is printed (form and history are hidden)

## Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **react-barcode**: Barcode generation library
- **jsbarcode**: Barcode rendering engine

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

MIT


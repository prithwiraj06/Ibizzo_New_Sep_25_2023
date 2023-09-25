export class productData {
  static productListData = [
    { id: 1, productKeyword: 'Red Zone Forklift Warning Lights', source: 'assets/Images/Product/product-1.png', CategoryId: 4, Category: 'Vehicle Lighting', productName: 'Hsn:85920200', price: '2300-7400Inr', MOQ: '25pcs', desc1: 'Ospen make,SS material', desc2: '12w/24v-80v', desc3: '20,000 hours life', unit: 1, quantity: 1, per: 1, urls: [ 'assets/Images/Product/product-3.png' ] },
    { id: 2, productKeyword: 'Blue Zone Forklift Warning Lights', source: 'assets/Images/Product/product-2.png', CategoryId: 4, Category: 'Vehicle Lighting', productName: 'Hsn:85920200', price: '2300-7400Inr', MOQ: '25pcs', desc1: 'Ospen make,SS material', desc2: '12w/24v-80v', desc3: '20,000 hours life', unit: 1, quantity: 1, per: 1, urls: [ 'assets/Images/Product/product-3.png' ] },
    { id: 3, productKeyword: 'Revolving Warning Lights', source: 'assets/Images/Product/product-3.png', CategoryId: 4, Category: 'Vehicle Lighting', productName: 'Hsn:85920200', price: '2300-7400Inr', MOQ: '25pcs', desc1: 'Ospen make,SS material', desc2: '12w/24v-80v', desc3: '20,000 hours life', unit: 1, quantity: 1, per: 1, urls: [ 'assets/Images/Product/product-3.png' ] },
  ];

  static categoryData = [
    { id: 1, name: 'category1' },
    { id: 2, name: 'category2' },
    { id: 3, name: 'category3' },
    { id: 4, name: 'Vehicle Lighting' }
  ];

  static productTypeOption = [
    { 'name': '-Select Type-', 'id': null },
    { 'name': 'Products', 'id': 1 },
    { 'name': 'Services', 'id': 2 },
  ]

  static ProductQuantityType = [
    { id: null, Type: '-Select Unit' },
    { id: 1, Type: 'Pieces' },
    { id: 2, Type: 'Kilograms' },
    { id: 3, Type: 'Tonnes' },
    { id: 4, Type: 'Meters' },
    { id: 5, Type: 'Litres' },
    { id: 6, Type: 'Feet' },
    { id: 7, Type: 'Inches' },
    { id: 8, Type: 'Grams' },
    { id: 9, Type: 'Milligrams' },
    { id: 10, Type: 'Gallon' },
    { id: 11, Type: 'Hour' },
    { id: 12, Type: 'Minutes' },
    { id: 13, Type: 'Dozen' },
    { id: 14, Type: 'Sq Feet' },
    { id: 15, Type: 'Sq Meter' }
  ];

  static SupplyDurationType = [
    { id: null, Type: '-Select per-' },
    { id: 1, Type: 'Day' },
    { id: 2, Type: 'Week' },
    { id: 3, Type: 'Month' },
    { id: 4, Type: 'Year' }
  ];

  static frequencyData = [
    { id: null, Type: '-Select Frequency-' },
    { id: 1, Type: 'One Time' },
    { id: 2, Type: 'Just In Time' },
    { id: 3, Type: 'Weekly' },
    { id: 4, Type: 'Monthly' },
    { id: 5, Type: 'Quarterly' },
    { id: 6, Type: 'Yearly' },
    { id: 7, Type: 'Others' } ]

  static BuyerIndustry = [
    { unsbcCode: 1, name: 'All' },
    { unsbcCode: 2, name: 'General' },
    { unsbcCode: 3, name: 'Consumer' }
  ]

  static AnnualTurnOverList: any = [
    { text: 'Below 10 lakhs', value: 1 },
    { text: '10 - 50 lakhs', value: 2 },
    { text: '50 lakhs - 2 crores', value: 3 },
    { text: '2 - 5 crores', value: 4 },
    { text: '5 - 20 crores', value: 5 },
    { text: '20 - 100 crores', value: 6 },
    { text: '100 - 500 crores', value: 7 },
    { text: 'Above 500 crores', value: 8 },
  ];
}
const products = [
  {
    id: 'customization-prod-1',
    category: 'beds',
    name: 'bedOne',
    src: './assets/customization/beds/bed1.png',
    price: 98600,
  },
  {
    id: 'customization-prod-2',
    category: 'beds',
    name: 'bedTwo',
    src: './assets/customization/beds/bed2.png',
    price: 105000,
  },
  {
    id: 'customization-prod-3',
    category: 'beds',
    name: 'bedThree',
    src: './assets/customization/beds/bed3.png',
    price: 150000,
  },
  {
    id: 'customization-prod-4',
    category: 'beds',
    name: 'bedFour',
    src: './assets/customization/beds/bed4.png',
    price: 70000,
  },
  {
    id: 'customization-prod-5',
    category: 'beds',
    name: 'bedFive',
    src: './assets/customization/beds/bed5.png',
    price: 90000,
  },
  {
    id: 'customization-prod-6',
    category: 'beds',
    name: 'bedSix',
    src: './assets/customization/beds/bed6.png',
    price: 95000,
  },
  {
    id: 'customization-prod-7',
    category: 'beds',
    name: 'bedSeven',
    src: './assets/customization/beds/bed7.png',
    price: 130000,
  },
  {
    id: 'customization-prod-8',
    category: 'tables',
    name: 'tableOne',
    src: './assets/customization/tables/table1.png',
    price: 98000,
  },
  {
    id: 'customization-prod-9',
    category: 'tables',
    name: 'tableTwo',
    src: './assets/customization/tables/table2.png',
    price: 75000,
  },
  {
    id: 'customization-prod-10',
    category: 'tables',
    name: 'tableThree',
    src: './assets/customization/tables/table3.png',
    price: 68000,
  },
  {
    id: 'customization-prod-11',
    category: 'tables',
    name: 'tableFour',
    src: './assets/customization/tables/table4.png',
    price: 56000,
  },
  {
    id: 'customization-prod-12',
    category: 'tables',
    name: 'tableFive',
    src: './assets/customization/tables/table5.png',
    price: 61000,
  },
  {
    id: 'customization-prod-13',
    category: 'tables',
    name: 'tableSix',
    src: './assets/customization/tables/table6.png',
    price: 53000,
  },
  {
    id: 'customization-prod-14',
    category: 'sofas',
    name: 'sofaOne',
    src: './assets/customization/sofas/sofa1.png',
    price: 15000,
  },
  {
    id: 'customization-prod-15',
    category: 'sofas',
    name: 'sofaTwo',
    src: './assets/customization/sofas/sofa2.png',
    price: 44000,
  },
  {
    id: 'customization-prod-16',
    category: 'sofas',
    name: 'sofaThree',
    src: './assets/customization/sofas/sofa3.png',
    price: 55000,
  },
  {
    id: 'customization-prod-17',
    category: 'sofas',
    name: 'sofaFour',
    src: './assets/customization/sofas/sofa4.png',
    price: 95000,
  },
  {
    id: 'customization-prod-18',
    category: 'sofas',
    name: 'sofaFive',
    src: './assets/customization/sofas/sofa5.png',
    price: 100000,
  },
  {
    id: 'customization-prod-19',
    category: 'sofas',
    name: 'sofaSix',
    src: './assets/customization/sofas/sofa6.png',
    price: 60000,
  },
  {
    id: 'customization-prod-20',
    category: 'sofas',
    name: 'sofaSeven',
    src: './assets/customization/sofas/sofa7.png',
    price: 95000,
  },
  {
    id: 'customization-prod-21',
    category: 'sofas',
    name: 'sofaEight',
    src: './assets/customization/sofas/sofa8.png',
    price: 135000,
  },
  {
    id: 'customization-prod-22',
    category: 'sofas',
    name: 'sofaNine',
    src: './assets/customization/sofas/sofa9.png',
    price: 110000,
  },
  {
    id: 'customization-prod-23',
    category: 'side-table',
    name: 'sideTableOne',
    src: './assets/customization/lamps/lamp1.png',
    price: 1500,
  },
  {
    id: 'customization-prod-24',
    category: 'side-table',
    name: 'sideTableTwo',
    src: './assets/customization/lamps/lamp2.png',
    price: 3500,
  },
  {
    id: 'customization-prod-25',
    category: 'side-table',
    name: 'sideTableThree',
    src: './assets/customization/lamps/lamp3.png',
    price: 2500,
  },
  {
    id: 'customization-prod-26',
    category: 'side-table',
    name: 'sideTableFour',
    src: './assets/customization/lamps/lamp4.png',
    price: 4999,
  },
  {
    id: 'customization-prod-27',
    category: 'side-table',
    name: 'sideTableFive',
    src: './assets/customization/lamps/lamp5.png',
    price: 3800,
  },
  {
    id: 'customization-prod-28',
    category: 'side-table',
    name: 'sideTableSix',
    src: './assets/customization/lamps/lamp6.png',
    price: 3000,
  },
  {
    id: 'customization-prod-29',
    category: 'side-table',
    name: 'sideTableSeven',
    src: './assets/customization/lamps/lamp7.png',
    price: 2700,
  },
  {
    id: 'customization-prod-30',
    category: 'baskets',
    name: 'basketOne',
    src: './assets/customization/baskets/basket1.png',
    price: 1000,
  },
  {
    id: 'customization-prod-31',
    category: 'baskets',
    name: 'basketTwo',
    src: './assets/customization/baskets/basket2.png',
    price: 1200,
  },
  {
    id: 'customization-prod-32',
    category: 'flowers',
    name: 'flowerOne',
    src: './assets/customization/flowers/flower1.png',
    price: 740,
  },
  {
    id: 'customization-prod-33',
    category: 'flowers',
    name: 'flowerTwo',
    src: './assets/customization/flowers/flower2.png',
    price: 680,
  },
  {
    id: 'customization-prod-34',
    category: 'flowers',
    name: 'flowerThree',
    src: './assets/customization/flowers/flower3.png',
    price: 910,
  },
];

export default products;

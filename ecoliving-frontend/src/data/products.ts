import { Product } from '../types';

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Canasta de Verduras Orgánicas',
    description: 'Selección fresca de verduras orgánicas de temporada. Incluye lechuga, tomate, zanahoria y más.',
    price: 24.99,
    category: 'Frutas y Verduras',
    image: 'https://images.unsplash.com/photo-1657288089316-c0350003ca49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwdmVnZXRhYmxlcyUyMGZyZXNofGVufDF8fHx8MTc2MDYxMjUzOXww&ixlib=rb-4.1.0&q=80&w=1080',
    stock: 45,
    ecoFeatures: ['100% Orgánico', 'Sin pesticidas', 'Cultivo local']
  },
  {
    id: '2',
    name: 'Frutas Orgánicas Mixtas',
    description: 'Caja con frutas frescas orgánicas: manzanas, naranjas, plátanos y fresas de cultivo ecológico.',
    price: 28.50,
    category: 'Frutas y Verduras',
    image: 'https://images.unsplash.com/photo-1759508858607-d2cb26efdbcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZnJ1aXRzJTIwYmFza2V0fGVufDF8fHx8MTc2MDU3MjA1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    stock: 60,
    ecoFeatures: ['Certificado orgánico', 'Sin químicos', 'Cosecha fresca']
  },
  {
    id: '3',
    name: 'Mix de Granos Integrales',
    description: 'Mezcla de granos orgánicos: arroz integral, avena, quinoa y amaranto. 1kg.',
    price: 15.99,
    category: 'Granos y Cereales',
    image: 'https://images.unsplash.com/photo-1547978059-2639fd612c66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZ3JhaW5zJTIwY2VyZWFsc3xlbnwxfHx8fDE3NjA2MTY3OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    stock: 120,
    ecoFeatures: ['Grano entero', 'Sin refinar', 'Alta fibra']
  },
  {
    id: '4',
    name: 'Aceite de Oliva Extra Virgen',
    description: 'Aceite de oliva orgánico extra virgen de primera prensada en frío. 500ml.',
    price: 22.00,
    category: 'Aceites y Condimentos',
    image: 'https://images.unsplash.com/photo-1758524152286-e3b8ebdab25b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwb2xpdmUlMjBvaWx8ZW58MXx8fHwxNzYwNjE4NjU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    stock: 85,
    ecoFeatures: ['Primera presión', 'Sin aditivos', 'Botella de vidrio']
  },
  {
    id: '5',
    name: 'Miel Orgánica Pura',
    description: 'Miel 100% natural de abejas libres, sin procesar ni pasteurizar. 500g.',
    price: 18.99,
    category: 'Endulzantes Naturales',
    image: 'https://images.unsplash.com/photo-1645549826194-1956802d83c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwaG9uZXklMjBqYXJ8ZW58MXx8fHwxNzYwNTU3ODYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    stock: 75,
    ecoFeatures: ['Sin pasteurizar', 'Apicultura sostenible', 'Pura y natural']
  },
  {
    id: '6',
    name: 'Té de Hierbas Orgánico',
    description: 'Selección de tés herbales orgánicos: manzanilla, menta y jengibre. 20 bolsitas.',
    price: 12.50,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1530104058652-53c30dab1fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwdGVhJTIwaGVyYnN8ZW58MXx8fHwxNzYwNjE4NjU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    stock: 150,
    ecoFeatures: ['Hierbas orgánicas', 'Sin aditivos', 'Empaque biodegradable']
  },
  {
    id: '7',
    name: 'Mezcla de Frutos Secos',
    description: 'Mix premium de almendras, nueces, cashews y pistachos orgánicos. 500g.',
    price: 26.99,
    category: 'Snacks Saludables',
    image: 'https://images.unsplash.com/photo-1666637155182-8c8d3b613276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwbnV0cyUyMGFsbW9uZHN8ZW58MXx8fHwxNzYwNTIzNjMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    stock: 95,
    ecoFeatures: ['Sin sal', 'Sin tostar', 'Proteína natural']
  },
  {
    id: '8',
    name: 'Café Orgánico Molido',
    description: 'Café orgánico de altura, tostado medio y molido. Comercio justo. 500g.',
    price: 19.99,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1574081106041-f16966db53d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY29mZmVlJTIwYmVhbnN8ZW58MXx8fHwxNzYwNjE4NjU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    stock: 110,
    ecoFeatures: ['Comercio justo', 'Tostado artesanal', 'Aromático']
  },
  {
    id: '9',
    name: 'Quinoa Orgánica',
    description: 'Quinoa blanca orgánica de alta calidad, rica en proteína. 1kg.',
    price: 14.50,
    category: 'Granos y Cereales',
    image: 'https://images.unsplash.com/photo-1722882270502-4758cbd78661?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwcXVpbm9hJTIwc2VlZHN8ZW58MXx8fHwxNzYwNjE4NjU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    stock: 130,
    ecoFeatures: ['Alto en proteína', 'Sin gluten', 'Superalimento']
  },
  {
    id: '10',
    name: 'Pasta Integral Orgánica',
    description: 'Pasta de trigo integral orgánico, varias formas. 500g.',
    price: 8.99,
    category: 'Granos y Cereales',
    image: 'https://images.unsplash.com/photo-1613634333954-085b019d87b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwcGFzdGElMjB3aG9sZSUyMGdyYWlufGVufDF8fHx8MTc2MDYxODY2MHww&ixlib=rb-4.1.0&q=80&w=1080',
    stock: 140,
    ecoFeatures: ['Grano entero', 'Fibra alta', 'Hecho artesanal']
  },
  {
    id: '11',
    name: 'Chocolate Orgánico 70%',
    description: 'Chocolate oscuro orgánico con 70% de cacao, endulzado con azúcar de caña. 100g.',
    price: 6.99,
    category: 'Snacks Saludables',
    image: 'https://images.unsplash.com/photo-1646168932800-e48f378d37bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZGFyayUyMGNob2NvbGF0ZXxlbnwxfHx8fDE3NjA2MTg2NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    stock: 180,
    ecoFeatures: ['Comercio justo', 'Sin lácteos', 'Antioxidantes']
  },
  {
    id: '12',
    name: 'Aceite de Coco Virgen',
    description: 'Aceite de coco orgánico virgen prensado en frío, multiusos. 500ml.',
    price: 16.50,
    category: 'Aceites y Condimentos',
    image: 'https://images.unsplash.com/photo-1587890767851-e9bc526764b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY29jb251dCUyMG9pbHxlbnwxfHx8fDE3NjA2MTg2NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    stock: 100,
    ecoFeatures: ['Prensado en frío', 'Sin refinar', 'Multiusos']
  }
];

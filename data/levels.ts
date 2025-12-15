import { Level, Category } from '@/types';

export const levels: Level[] = [
  // Animals - Level 1
  {
    id: 'animals-1',
    category: 'animals',
    levelNumber: 1,
    title: 'Farm Animals',
    requiredStars: 0,
    unlocked: true,
    items: [
      { id: 'cow', name: 'Cow', pronunciation: 'cow' },
      { id: 'chicken', name: 'Chicken', pronunciation: 'chicken' },
      { id: 'sheep', name: 'Sheep', pronunciation: 'sheep' },
      { id: 'horse', name: 'Horse', pronunciation: 'horse' },
      { id: 'duck', name: 'Duck', pronunciation: 'duck' },
      { id: 'goat', name: 'Goat', pronunciation: 'goat' },
      { id: 'rabbit', name: 'Rabbit', pronunciation: 'rabbit' },
      { id: 'donkey', name: 'Donkey', pronunciation: 'donkey' },
      { id: 'rooster', name: 'Rooster', pronunciation: 'rooster' },
    ],
  },
  // Animals - Level 2
  {
    id: 'animals-2',
    category: 'animals',
    levelNumber: 2,
    title: 'Wild Animals',
    requiredStars: 3,
    unlocked: false,
    items: [
      { id: 'lion', name: 'Lion', pronunciation: 'lion' },
      { id: 'elephant', name: 'Elephant', pronunciation: 'elephant' },
      { id: 'tiger', name: 'Tiger', pronunciation: 'tiger' },
      { id: 'bear', name: 'Bear', pronunciation: 'bear' },
      { id: 'monkey', name: 'Monkey', pronunciation: 'monkey' },
      { id: 'giraffe', name: 'Giraffe', pronunciation: 'giraffe' },
      { id: 'zebra', name: 'Zebra', pronunciation: 'zebra' },
      { id: 'wolf', name: 'Wolf', pronunciation: 'wolf' },
      { id: 'fox', name: 'Fox', pronunciation: 'fox' },
      { id: 'panda', name: 'Panda', pronunciation: 'panda' },
    ],
  },
  // Animals - Level 3
  {
    id: 'animals-3',
    category: 'animals',
    levelNumber: 3,
    title: 'Sea Animals',
    requiredStars: 6,
    unlocked: false,
    items: [
      { id: 'fish', name: 'Fish', pronunciation: 'fish' },
      { id: 'dolphin', name: 'Dolphin', pronunciation: 'dolphin' },
      { id: 'whale', name: 'Whale', pronunciation: 'whale' },
      { id: 'shark', name: 'Shark', pronunciation: 'shark' },
      { id: 'octopus', name: 'Octopus', pronunciation: 'octopus' },
      { id: 'seal', name: 'Seal', pronunciation: 'seal' },
    ],
  },
  // Animals - Level 4
  {
    id: 'animals-4',
    category: 'animals',
    levelNumber: 4,
    title: 'Birds',
    requiredStars: 9,
    unlocked: false,
    items: [
      { id: 'eagle', name: 'Eagle', pronunciation: 'eagle' },
      { id: 'owl', name: 'Owl', pronunciation: 'owl' },
      { id: 'parrot', name: 'Parrot', pronunciation: 'parrot' },
      { id: 'penguin', name: 'Penguin', pronunciation: 'penguin' },
      { id: 'flamingo', name: 'Flamingo', pronunciation: 'flamingo' },
      { id: 'peacock', name: 'Peacock', pronunciation: 'peacock' },
    ],
  },
  // Numbers - Level 1
  {
    id: 'numbers-1',
    category: 'numbers',
    levelNumber: 1,
    title: 'Numbers 1-5',
    requiredStars: 0,
    unlocked: true,
    items: [
      { 
        id: '1', 
        name: 'One', 
        pronunciation: 'one', 
        sound: require('@/assets/numbers/en/1.mp3'),
        data: { number: 1, count: 1 } 
      },
      { 
        id: '2', 
        name: 'Two', 
        pronunciation: 'two', 
        sound: require('@/assets/numbers/en/2.mp3'),
        data: { number: 2, count: 2 } 
      },
      { 
        id: '3', 
        name: 'Three', 
        pronunciation: 'three', 
        sound: require('@/assets/numbers/en/3.mp3'),
        data: { number: 3, count: 3 } 
      },
      { 
        id: '4', 
        name: 'Four', 
        pronunciation: 'four', 
        sound: require('@/assets/numbers/en/4.mp3'),
        data: { number: 4, count: 4 } 
      },
      { 
        id: '5', 
        name: 'Five', 
        pronunciation: 'five', 
        sound: require('@/assets/numbers/en/5.mp3'),
        data: { number: 5, count: 5 } 
      },
    ],
  },
  // Numbers - Level 2
  {
    id: 'numbers-2',
    category: 'numbers',
    levelNumber: 2,
    title: 'Numbers 6-10',
    requiredStars: 3,
    unlocked: false,
    items: [
      { 
        id: '6', 
        name: 'Six', 
        pronunciation: 'six', 
        sound: require('@/assets/numbers/en/6.mp3'),
        data: { number: 6, count: 6 } 
      },
      { 
        id: '7', 
        name: 'Seven', 
        pronunciation: 'seven', 
        sound: require('@/assets/numbers/en/7.mp3'),
        data: { number: 7, count: 7 } 
      },
      { 
        id: '8', 
        name: 'Eight', 
        pronunciation: 'eight', 
        sound: require('@/assets/numbers/en/8.mp3'),
        data: { number: 8, count: 8 } 
      },
      { 
        id: '9', 
        name: 'Nine', 
        pronunciation: 'nine', 
        sound: require('@/assets/numbers/en/9.mp3'),
        data: { number: 9, count: 9 } 
      },
      { 
        id: '10', 
        name: 'Ten', 
        pronunciation: 'ten', 
        sound: require('@/assets/numbers/en/10.mp3'),
        data: { number: 10, count: 10 } 
      },
    ],
  },
  // Numbers - Level 3
  {
    id: 'numbers-3',
    category: 'numbers',
    levelNumber: 3,
    title: 'Numbers 11-15',
    requiredStars: 6,
    unlocked: false,
    items: [
      { 
        id: '11', 
        name: 'Eleven', 
        pronunciation: 'eleven', 
        sound: require('@/assets/numbers/en/11.mp3'),
        data: { number: 11, count: 11 } 
      },
      { 
        id: '12', 
        name: 'Twelve', 
        pronunciation: 'twelve', 
        sound: require('@/assets/numbers/en/12.mp3'),
        data: { number: 12, count: 12 } 
      },
      { 
        id: '13', 
        name: 'Thirteen', 
        pronunciation: 'thirteen', 
        sound: require('@/assets/numbers/en/13.mp3'),
        data: { number: 13, count: 13 } 
      },
      { 
        id: '14', 
        name: 'Fourteen', 
        pronunciation: 'fourteen', 
        sound: require('@/assets/numbers/en/14.mp3'),
        data: { number: 14, count: 14 } 
      },
      { 
        id: '15', 
        name: 'Fifteen', 
        pronunciation: 'fifteen', 
        sound: require('@/assets/numbers/en/15.mp3'),
        data: { number: 15, count: 15 } 
      },
    ],
  },
  // Numbers - Level 4
  {
    id: 'numbers-4',
    category: 'numbers',
    levelNumber: 4,
    title: 'Numbers 16-20',
    requiredStars: 9,
    unlocked: false,
    items: [
      { 
        id: '16', 
        name: 'Sixteen', 
        pronunciation: 'sixteen', 
        sound: require('@/assets/numbers/en/16.mp3'),
        data: { number: 16, count: 16 } 
      },
      { 
        id: '17', 
        name: 'Seventeen', 
        pronunciation: 'seventeen', 
        sound: require('@/assets/numbers/en/17.mp3'),
        data: { number: 17, count: 17 } 
      },
      { 
        id: '18', 
        name: 'Eighteen', 
        pronunciation: 'eighteen', 
        sound: require('@/assets/numbers/en/18.mp3'),
        data: { number: 18, count: 18 } 
      },
      { 
        id: '19', 
        name: 'Nineteen', 
        pronunciation: 'nineteen', 
        sound: require('@/assets/numbers/en/19.mp3'),
        data: { number: 19, count: 19 } 
      },
      { 
        id: '20', 
        name: 'Twenty', 
        pronunciation: 'twenty', 
        sound: require('@/assets/numbers/en/20.mp3'),
        data: { number: 20, count: 20 } 
      },
    ],
  },
  // Colors - Level 1
  {
    id: 'colors-1',
    category: 'colors',
    levelNumber: 1,
    title: 'Basic Colors',
    requiredStars: 0,
    unlocked: true,
    items: [
      { id: 'red', name: 'Red', pronunciation: 'red', data: { color: '#FF0000' } },
      { id: 'blue', name: 'Blue', pronunciation: 'blue', data: { color: '#0000FF' } },
      { id: 'yellow', name: 'Yellow', pronunciation: 'yellow', data: { color: '#FFFF00' } },
      { id: 'green', name: 'Green', pronunciation: 'green', data: { color: '#00FF00' } },
      { id: 'orange', name: 'Orange', pronunciation: 'orange', data: { color: '#FFA500' } },
    ],
  },
  // Colors - Level 2
  {
    id: 'colors-2',
    category: 'colors',
    levelNumber: 2,
    title: 'More Colors',
    requiredStars: 3,
    unlocked: false,
    items: [
      { id: 'purple', name: 'Purple', pronunciation: 'purple', data: { color: '#800080' } },
      { id: 'pink', name: 'Pink', pronunciation: 'pink', data: { color: '#FFC0CB' } },
      { id: 'brown', name: 'Brown', pronunciation: 'brown', data: { color: '#A52A2A' } },
      { id: 'black', name: 'Black', pronunciation: 'black', data: { color: '#000000' } },
      { id: 'white', name: 'White', pronunciation: 'white', data: { color: '#FFFFFF' } },
      { id: 'gray', name: 'Gray', pronunciation: 'gray', data: { color: '#808080' } },
    ],
  },
  // Colors - Level 3
  {
    id: 'colors-3',
    category: 'colors',
    levelNumber: 3,
    title: 'Pastel Colors',
    requiredStars: 6,
    unlocked: false,
    items: [
      { id: 'lavender', name: 'Lavender', pronunciation: 'lavender', data: { color: '#E6E6FA' } },
      { id: 'mint', name: 'Mint', pronunciation: 'mint', data: { color: '#98FF98' } },
      { id: 'peach', name: 'Peach', pronunciation: 'peach', data: { color: '#FFDAB9' } },
      { id: 'sky-blue', name: 'Sky Blue', pronunciation: 'sky blue', data: { color: '#87CEEB' } },
      { id: 'rose', name: 'Rose', pronunciation: 'rose', data: { color: '#FFB6C1' } },
    ],
  },
  // Colors - Level 4
  {
    id: 'colors-4',
    category: 'colors',
    levelNumber: 4,
    title: 'Bright Colors',
    requiredStars: 9,
    unlocked: false,
    items: [
      { id: 'cyan', name: 'Cyan', pronunciation: 'cyan', data: { color: '#00FFFF' } },
      { id: 'magenta', name: 'Magenta', pronunciation: 'magenta', data: { color: '#FF00FF' } },
      { id: 'lime', name: 'Lime', pronunciation: 'lime', data: { color: '#00FF00' } },
      { id: 'gold', name: 'Gold', pronunciation: 'gold', data: { color: '#FFD700' } },
      { id: 'silver', name: 'Silver', pronunciation: 'silver', data: { color: '#C0C0C0' } },
    ],
  },
  // Shapes - Level 1
  {
    id: 'shapes-1',
    category: 'shapes',
    levelNumber: 1,
    title: 'Basic Shapes',
    requiredStars: 0,
    unlocked: true,
    items: [
      { id: 'circle', name: 'Circle', pronunciation: 'circle', data: { shape: 'circle' } },
      { id: 'square', name: 'Square', pronunciation: 'square', data: { shape: 'square' } },
      { id: 'triangle', name: 'Triangle', pronunciation: 'triangle', data: { shape: 'triangle' } },
      { id: 'rectangle', name: 'Rectangle', pronunciation: 'rectangle', data: { shape: 'rectangle' } },
      { id: 'star', name: 'Star', pronunciation: 'star', data: { shape: 'star' } },
    ],
  },
  // Shapes - Level 2
  {
    id: 'shapes-2',
    category: 'shapes',
    levelNumber: 2,
    title: 'More Shapes',
    requiredStars: 3,
    unlocked: false,
    items: [
      { id: 'oval', name: 'Oval', pronunciation: 'oval', data: { shape: 'oval' } },
      { id: 'diamond', name: 'Diamond', pronunciation: 'diamond', data: { shape: 'diamond' } },
      { id: 'heart', name: 'Heart', pronunciation: 'heart', data: { shape: 'heart' } },
      { id: 'hexagon', name: 'Hexagon', pronunciation: 'hexagon', data: { shape: 'hexagon' } },
      { id: 'pentagon', name: 'Pentagon', pronunciation: 'pentagon', data: { shape: 'pentagon' } },
    ],
  },
  // Shapes - Level 3
  {
    id: 'shapes-3',
    category: 'shapes',
    levelNumber: 3,
    title: 'Advanced Shapes',
    requiredStars: 6,
    unlocked: false,
    items: [
      { id: 'trapezoid', name: 'Trapezoid', pronunciation: 'trapezoid', data: { shape: 'trapezoid' } },
      { id: 'parallelogram', name: 'Parallelogram', pronunciation: 'parallelogram', data: { shape: 'parallelogram' } },
      { id: 'rhombus', name: 'Rhombus', pronunciation: 'rhombus', data: { shape: 'rhombus' } },
      { id: 'crescent', name: 'Crescent', pronunciation: 'crescent', data: { shape: 'crescent' } },
      { id: 'arrow', name: 'Arrow', pronunciation: 'arrow', data: { shape: 'arrow' } },
    ],
  },
  // Shapes - Level 4
  {
    id: 'shapes-4',
    category: 'shapes',
    levelNumber: 4,
    title: '3D Shapes',
    requiredStars: 9,
    unlocked: false,
    items: [
      { id: 'cube', name: 'Cube', pronunciation: 'cube', data: { shape: 'cube' } },
      { id: 'sphere', name: 'Sphere', pronunciation: 'sphere', data: { shape: 'sphere' } },
      { id: 'cylinder', name: 'Cylinder', pronunciation: 'cylinder', data: { shape: 'cylinder' } },
      { id: 'cone', name: 'Cone', pronunciation: 'cone', data: { shape: 'cone' } },
      { id: 'pyramid', name: 'Pyramid', pronunciation: 'pyramid', data: { shape: 'pyramid' } },
    ],
  },
  // Countries - Level 1
  {
    id: 'countries-1',
    category: 'countries',
    levelNumber: 1,
    title: 'Countries',
    requiredStars: 0,
    unlocked: true,
    items: [
      { id: 'france', name: 'France', pronunciation: 'france' },
      { id: 'usa', name: 'USA', pronunciation: 'usa' },
      { id: 'uk', name: 'UK', pronunciation: 'uk' },
      { id: 'japan', name: 'Japan', pronunciation: 'japan' },
      { id: 'brazil', name: 'Brazil', pronunciation: 'brazil' },
      { id: 'egypt', name: 'Egypt', pronunciation: 'egypt' },
    ],
  },
  // Countries - Level 2
  {
    id: 'countries-2',
    category: 'countries',
    levelNumber: 2,
    title: 'European Countries',
    requiredStars: 3,
    unlocked: false,
    items: [
      { id: 'germany', name: 'Germany', pronunciation: 'germany' },
      { id: 'spain', name: 'Spain', pronunciation: 'spain' },
      { id: 'italy', name: 'Italy', pronunciation: 'italy' },
      { id: 'greece', name: 'Greece', pronunciation: 'greece' },
      { id: 'netherlands', name: 'Netherlands', pronunciation: 'netherlands' },
      { id: 'sweden', name: 'Sweden', pronunciation: 'sweden' },
    ],
  },
  // Countries - Level 3
  {
    id: 'countries-3',
    category: 'countries',
    levelNumber: 3,
    title: 'Asian Countries',
    requiredStars: 6,
    unlocked: false,
    items: [
      { id: 'china', name: 'China', pronunciation: 'china' },
      { id: 'india', name: 'India', pronunciation: 'india' },
      { id: 'south-korea', name: 'South Korea', pronunciation: 'south korea' },
      { id: 'thailand', name: 'Thailand', pronunciation: 'thailand' },
      { id: 'singapore', name: 'Singapore', pronunciation: 'singapore' },
      { id: 'indonesia', name: 'Indonesia', pronunciation: 'indonesia' },
    ],
  },
  // Countries - Level 4
  {
    id: 'countries-4',
    category: 'countries',
    levelNumber: 4,
    title: 'African Countries',
    requiredStars: 9,
    unlocked: false,
    items: [
      { id: 'south-africa', name: 'South Africa', pronunciation: 'south africa' },
      { id: 'kenya', name: 'Kenya', pronunciation: 'kenya' },
      { id: 'morocco', name: 'Morocco', pronunciation: 'morocco' },
      { id: 'nigeria', name: 'Nigeria', pronunciation: 'nigeria' },
      { id: 'tanzania', name: 'Tanzania', pronunciation: 'tanzania' },
      { id: 'ghana', name: 'Ghana', pronunciation: 'ghana' },
    ],
  },
  // Fruits & Vegetables - Level 1
  {
    id: 'fruits-1',
    category: 'fruits',
    levelNumber: 1,
    title: 'Fruits & Vegetables',
    requiredStars: 0,
    unlocked: true,
    items: [
      { id: 'apple', name: 'Apple', pronunciation: 'apple' },
      { id: 'banana', name: 'Banana', pronunciation: 'banana' },
      { id: 'orange-fruit', name: 'Orange', pronunciation: 'orange' },
      { id: 'carrot', name: 'Carrot', pronunciation: 'carrot' },
      { id: 'tomato', name: 'Tomato', pronunciation: 'tomato' },
      { id: 'broccoli', name: 'Broccoli', pronunciation: 'broccoli' },
    ],
  },
  // Fruits & Vegetables - Level 2
  {
    id: 'fruits-2',
    category: 'fruits',
    levelNumber: 2,
    title: 'More Fruits',
    requiredStars: 3,
    unlocked: false,
    items: [
      { id: 'strawberry', name: 'Strawberry', pronunciation: 'strawberry' },
      { id: 'grape', name: 'Grape', pronunciation: 'grape' },
      { id: 'watermelon', name: 'Watermelon', pronunciation: 'watermelon' },
      { id: 'pineapple', name: 'Pineapple', pronunciation: 'pineapple' },
      { id: 'mango', name: 'Mango', pronunciation: 'mango' },
      { id: 'kiwi', name: 'Kiwi', pronunciation: 'kiwi' },
    ],
  },
  // Fruits & Vegetables - Level 3
  {
    id: 'fruits-3',
    category: 'fruits',
    levelNumber: 3,
    title: 'More Vegetables',
    requiredStars: 6,
    unlocked: false,
    items: [
      { id: 'potato', name: 'Potato', pronunciation: 'potato' },
      { id: 'onion', name: 'Onion', pronunciation: 'onion' },
      { id: 'pepper', name: 'Pepper', pronunciation: 'pepper' },
      { id: 'cucumber', name: 'Cucumber', pronunciation: 'cucumber' },
      { id: 'lettuce', name: 'Lettuce', pronunciation: 'lettuce' },
      { id: 'corn', name: 'Corn', pronunciation: 'corn' },
    ],
  },
  // Fruits & Vegetables - Level 4
  {
    id: 'fruits-4',
    category: 'fruits',
    levelNumber: 4,
    title: 'Mixed Fruits & Vegetables',
    requiredStars: 9,
    unlocked: false,
    items: [
      { id: 'cherry', name: 'Cherry', pronunciation: 'cherry' },
      { id: 'pear', name: 'Pear', pronunciation: 'pear' },
      { id: 'cabbage', name: 'Cabbage', pronunciation: 'cabbage' },
      { id: 'spinach', name: 'Spinach', pronunciation: 'spinach' },
      { id: 'peas', name: 'Peas', pronunciation: 'peas' },
      { id: 'beans', name: 'Beans', pronunciation: 'beans' },
    ],
  },
  // Sports - Level 1
  {
    id: 'sports-1',
    category: 'sports',
    levelNumber: 1,
    title: 'Sports',
    requiredStars: 0,
    unlocked: true,
    items: [
      { id: 'football', name: 'Football', pronunciation: 'football' },
      { id: 'basketball', name: 'Basketball', pronunciation: 'basketball' },
      { id: 'tennis', name: 'Tennis', pronunciation: 'tennis' },
      { id: 'swimming', name: 'Swimming', pronunciation: 'swimming' },
      { id: 'cycling', name: 'Cycling', pronunciation: 'cycling' },
      { id: 'running', name: 'Running', pronunciation: 'running' },
    ],
  },
  // Sports - Level 2
  {
    id: 'sports-2',
    category: 'sports',
    levelNumber: 2,
    title: 'Water Sports',
    requiredStars: 3,
    unlocked: false,
    items: [
      { id: 'surfing', name: 'Surfing', pronunciation: 'surfing' },
      { id: 'diving', name: 'Diving', pronunciation: 'diving' },
      { id: 'sailing', name: 'Sailing', pronunciation: 'sailing' },
      { id: 'water-polo', name: 'Water Polo', pronunciation: 'water polo' },
      { id: 'rowing', name: 'Rowing', pronunciation: 'rowing' },
      { id: 'kayaking', name: 'Kayaking', pronunciation: 'kayaking' },
    ],
  },
  // Sports - Level 3
  {
    id: 'sports-3',
    category: 'sports',
    levelNumber: 3,
    title: 'Winter Sports',
    requiredStars: 6,
    unlocked: false,
    items: [
      { id: 'skiing', name: 'Skiing', pronunciation: 'skiing' },
      { id: 'snowboarding', name: 'Snowboarding', pronunciation: 'snowboarding' },
      { id: 'ice-skating', name: 'Ice Skating', pronunciation: 'ice skating' },
      { id: 'hockey', name: 'Hockey', pronunciation: 'hockey' },
      { id: 'curling', name: 'Curling', pronunciation: 'curling' },
      { id: 'sledding', name: 'Sledding', pronunciation: 'sledding' },
    ],
  },
  // Sports - Level 4
  {
    id: 'sports-4',
    category: 'sports',
    levelNumber: 4,
    title: 'Team Sports',
    requiredStars: 9,
    unlocked: false,
    items: [
      { id: 'volleyball', name: 'Volleyball', pronunciation: 'volleyball' },
      { id: 'baseball', name: 'Baseball', pronunciation: 'baseball' },
      { id: 'soccer', name: 'Soccer', pronunciation: 'soccer' },
      { id: 'rugby', name: 'Rugby', pronunciation: 'rugby' },
      { id: 'cricket', name: 'Cricket', pronunciation: 'cricket' },
      { id: 'handball', name: 'Handball', pronunciation: 'handball' },
    ],
  },
  // Vehicles - Level 1
  {
    id: 'vehicles-1',
    category: 'vehicles',
    levelNumber: 1,
    title: 'Vehicles',
    requiredStars: 0,
    unlocked: true,
    items: [
      { id: 'car', name: 'Car', pronunciation: 'car' },
      { id: 'bus', name: 'Bus', pronunciation: 'bus' },
      { id: 'train', name: 'Train', pronunciation: 'train' },
      { id: 'airplane', name: 'Airplane', pronunciation: 'airplane' },
      { id: 'boat', name: 'Boat', pronunciation: 'boat' },
      { id: 'bicycle', name: 'Bicycle', pronunciation: 'bicycle' },
    ],
  },
  // Vehicles - Level 2
  {
    id: 'vehicles-2',
    category: 'vehicles',
    levelNumber: 2,
    title: 'Air Vehicles',
    requiredStars: 3,
    unlocked: false,
    items: [
      { id: 'helicopter', name: 'Helicopter', pronunciation: 'helicopter' },
      { id: 'rocket', name: 'Rocket', pronunciation: 'rocket' },
      { id: 'hot-air-balloon', name: 'Hot Air Balloon', pronunciation: 'hot air balloon' },
      { id: 'drone', name: 'Drone', pronunciation: 'drone' },
      { id: 'glider', name: 'Glider', pronunciation: 'glider' },
      { id: 'jet', name: 'Jet', pronunciation: 'jet' },
    ],
  },
  // Vehicles - Level 3
  {
    id: 'vehicles-3',
    category: 'vehicles',
    levelNumber: 3,
    title: 'Water Vehicles',
    requiredStars: 6,
    unlocked: false,
    items: [
      { id: 'ship', name: 'Ship', pronunciation: 'ship' },
      { id: 'submarine', name: 'Submarine', pronunciation: 'submarine' },
      { id: 'yacht', name: 'Yacht', pronunciation: 'yacht' },
      { id: 'ferry', name: 'Ferry', pronunciation: 'ferry' },
      { id: 'canoe', name: 'Canoe', pronunciation: 'canoe' },
      { id: 'sailboat', name: 'Sailboat', pronunciation: 'sailboat' },
    ],
  },
  // Vehicles - Level 4
  {
    id: 'vehicles-4',
    category: 'vehicles',
    levelNumber: 4,
    title: 'Construction Vehicles',
    requiredStars: 9,
    unlocked: false,
    items: [
      { id: 'truck', name: 'Truck', pronunciation: 'truck' },
      { id: 'bulldozer', name: 'Bulldozer', pronunciation: 'bulldozer' },
      { id: 'crane', name: 'Crane', pronunciation: 'crane' },
      { id: 'excavator', name: 'Excavator', pronunciation: 'excavator' },
      { id: 'tractor', name: 'Tractor', pronunciation: 'tractor' },
      { id: 'forklift', name: 'Forklift', pronunciation: 'forklift' },
    ],
  },
];

export const getLevelsByCategory = (category: Category): Level[] => {
  return levels.filter(level => level.category === category);
};

export const getLevelById = (id: string): Level | undefined => {
  return levels.find(level => level.id === id);
};


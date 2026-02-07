// 

const menuData = {
    tacos: {
        name: '🌮 Tacos',
        items: [
            { id: 't1', name: 'Veg Taco', price: 89, description: 'Fresh vegetables in a crispy shell' },
            { id: 't2', name: 'Mix Veg Taco', price: 80, description: 'Assorted vegetables with special sauce' },
            { id: 't3', name: 'Mushroom Taco', price: 99, description: 'Sautéed mushrooms with herbs' },
            { id: 't4', name: 'Grilled Paneer Taco', price: 100, description: 'Grilled cottage cheese with spices' },
            { id: 't5', name: 'Crispy Paneer Taco', price: 100, description: 'Crispy fried paneer with tangy sauce' },
            { id: 't6', name: 'Paneer Makhni Taco', price: 100, description: 'Paneer in rich buttery gravy' },
            { id: 't7', name: 'Corn & Cheese Taco', price: 100, description: 'Sweet corn with melted cheese' }
        ]
    },

    fries: {
        name: '🍟 Fries',
        items: [
            { id: 'f1', name: 'Salted Fries', price: 90 },
            { id: 'f2', name: 'Masala Fries', price: 90 },
            { id: 'f3', name: 'American Fries', price: 120 },
            { id: 'f4', name: 'Achari Fries', price: 120 },
            { id: 'f5', name: 'Loaded Fries', price: 150, popular: true },
            { id: 'f6', name: 'Classic Crisper', price: 99 },
            { id: 'f7', name: 'Peri Peri Crisper', price: 99 },
            { id: 'f8', name: 'Truffle Potato Crisper', price: 130 },
            { id: 'f9', name: 'Lemon Fries', price: 160 },
            { id: 'f10', name: 'Peri Peri Fries', price: 99 },
            { id: 'f11', name: 'Cheesy Fries', price: 109 }
        ]
    },

    pizzas: {
        name: '🍕 Pizzas',
        items: [
            { id: 'p1', name: 'Margherita', price: 100 },
            { id: 'p2', name: 'Corn Pizza', price: 100 },
            { id: 'p3', name: 'Veg Delight', price: 210 },
            { id: 'p4', name: 'Paneer Delight', price: 210 },
            { id: 'p5', name: 'Golden Delight', price: 210 },
            { id: 'p6', name: 'Capsicum Pizza', price: 210 },
            { id: 'p7', name: 'Onion Pizza', price: 210 },
            { id: 'p8', name: 'Tomato Pizza', price: 210 },
            { id: 'p9', name: 'Paneer Tikka Delight', price: 150 },
            { id: 'p10', name: '5 Pepper Pizza Delight', price: 180 },
            { id: 'p11', name: 'Hawaiian Pizza Delight', price: 160 },
            { id: 'p12', name: 'Paneer Tikka Silver', price: 230 },
            { id: 'p13', name: '5 Pepper Pizza Silver', price: 200 },
            { id: 'p14', name: 'Hawaiian Pizza Silver', price: 210 },
            { id: 'p15', name: 'Burn to Hell', price: 220 },
            { id: 'p16', name: 'Anarkali Pizza', price: 200 },
            { id: 'p17', name: 'Mangalwar Pizza', price: 199 },
            { id: 'p18', name: 'Russian Pizza', price: 270 },
            { id: 'p19', name: 'Pastizza', price: 200 },
            { id: 'p20', name: 'Margherita Supreme', price: 220 },
            { id: 'p21', name: 'Farmhouse Pizza', price: 200 },
            { id: 'p22', name: 'Veggie Deluxe', price: 199 },
            { id: 'p23', name: 'Love in LPU', price: 270 },
            { id: 'p24', name: 'North Face Pizza', price: 190 }
        ]
    },

    burgers: {
        name: '🍔 Burgers',
        items: [
            { id: 'b1', name: 'Aloo Tikki', price: 60 },
            { id: 'b2', name: 'Cheese Burst Burger', price: 90 },
            { id: 'b3', name: 'Paneer Makhni', price: 99 },
            { id: 'b4', name: 'Maharaja Burger', price: 120 },
            { id: 'b5', name: 'Veg Sandwich', price: 90 },
            { id: 'b6', name: 'Cheesy Sandwich', price: 99 },
            { id: 'b7', name: 'Cheese & Corn', price: 99 },
            { id: 'b8', name: 'Mushroom', price: 110 },
            { id: 'b9', name: 'Paneer Tikka', price: 99 },
            { id: 'b10', name: 'BBQ Grill Burger', price: 99 },
            { id: 'b11', name: 'Korean Grill Burger', price: 109 }
        ]
    },

    sandwiches: {
        name: '🥪 Sandwiches',
        items: [
            { id: 's1', name: 'Paneer Tikka', price: 120 },
            { id: 's2', name: 'Hyderabadi', price: 150 },
            { id: 's3', name: 'Maharaja', price: 150 }
        ]
    },

    wraps: {
        name: '🌯 Wraps / Subs / Parcels',
        items: [
            { id: 'w1', name: 'Aloo Patty Wrap', price: 90 },
            { id: 'w2', name: 'Classic Veggie', price: 100 },
            { id: 'w3', name: 'Aloo Tikki Sub', price: 90 },
            { id: 'w4', name: 'Veggie Delight', price: 120 },
            { id: 'w5', name: 'Paneer Tikka Wrap', price: 140 },
            { id: 'w6', name: 'Crispy Paneer Sub', price: 150 },
            { id: 'w7', name: 'Zingy Parcel', price: 130 },
            { id: 'w8', name: 'Paneer Parcel', price: 150 },
            { id: 'w9', name: 'Achari Parcel', price: 160 },
            { id: 'w10', name: 'Mexican Cheese Corn Wrap', price: 110 },
            { id: 'w11', name: 'Korean Paneer Wrap', price: 120 }
        ]
    },

    momos: {
        name: '🥟 Momos & Nachos',
        items: [
            { id: 'm1', name: 'Veg Steam Momo', price: 89 },
            { id: 'm2', name: 'Paneer Steam Momo', price: 99 },
            { id: 'm3', name: 'Afghani Creamy Momo', price: 120 },
            { id: 'm4', name: 'Jhol Momo', price: 139 },
            { id: 'm5', name: 'Butter Masala Momo', price: 150 },
            { id: 'm6', name: 'Veg Fry Momo', price: 99 },
            { id: 'm7', name: 'Paneer Fry Momo', price: 99 },
            { id: 'm8', name: 'Peri Peri Momo', price: 109 },
            { id: 'm9', name: 'Nachos with Dip', price: 99 },
            { id: 'm10', name: 'Veg Nachos', price: 99 },
            { id: 'm11', name: 'Veggie Cheesy Nachos', price: 129 },
            { id: 'm12', name: 'Mexican Paneer Nachos', price: 139 }
        ]
    },

    pasta: {
        name: '🍝 Pasta',
        items: [
            { id: 'pa1', name: 'White Sauce Pasta', price: 120 },
            { id: 'pa2', name: 'Red Sauce Pasta', price: 120 },
            { id: 'pa3', name: 'Mix Veg Pasta', price: 150 },
            { id: 'pa4', name: 'Mix Baked Pasta', price: 159 },
            { id: 'pa5', name: 'Cheesy Pasta', price: 150 },
            { id: 'pa6', name: 'Bollywood Pasta', price: 150 }
        ]
    },

    breads: {
        name: '🍞 Breads & Desserts',
        items: [
            { id: 'br1', name: 'Grilled Garlic Bread', price: 80 },
            { id: 'br2', name: 'Garlic Cheese Toast', price: 90 },
            { id: 'br3', name: 'Stuffed Garlic Bread', price: 120 },
            { id: 'br4', name: 'Choco Lava Cake', price: 60 },
            { id: 'br5', name: 'Choco Brownie', price: 70 },
            { id: 'br6', name: 'Brownie Sundae', price: 150 }
        ]
    },

    maggi: {
        name: '🍜 Maggi',
        items: [
            { id: 'mg1', name: 'Plain Maggi', price: 80 },
            { id: 'mg2', name: 'Cheese & Corn Maggi', price: 99 },
            { id: 'mg3', name: 'Down Town Maggi', price: 120 },
            { id: 'mg4', name: 'Korean Maggi', price: 130 }
        ]
    },

    shakes: {
        name: '🥤 Shakes',
        items: [
            { id: 'sh1', name: 'Chocolate Shake', price: 70 },
            { id: 'sh2', name: 'Vanilla Shake', price: 70 },
            { id: 'sh3', name: 'Black Currant Shake', price: 80 },
            { id: 'sh4', name: 'Blueberry Shake', price: 80 },
            { id: 'sh5', name: 'Marshmallow Shake', price: 80 },
            { id: 'sh6', name: 'Kit Kat Shake', price: 90 },
            { id: 'sh7', name: 'Caramel Oreo Shake', price: 90 },
            { id: 'sh8', name: 'Dark Chocolate Shake', price: 90 },
            { id: 'sh9', name: 'Double Chocolate Shake', price: 90 },
            { id: 'sh10', name: 'Mango Shake', price: 90 },
            { id: 'sh11', name: 'Strawberry Shake', price: 70 },
            { id: 'sh12', name: 'Banana Shake', price: 70 },
            { id: 'sh13', name: 'Butter Scotch Shake', price: 80 }
        ]
    },

    smoothies: {
        name: '🥤 Smoothies',
        items: [
            { id: 'sm1', name: 'Full Power', price: 90 },
            { id: 'sm2', name: 'Berry Aloha', price: 100 },
            { id: 'sm3', name: 'Mango Paradise', price: 100 },
            { id: 'sm4', name: 'High Power', price: 150 },
            { id: 'sm5', name: 'Fruit Salad', price: 180 }
        ]
    },

    coffee: {
        name: '☕ Coffee & Hot Beverages',
        items: [
            { id: 'c1', name: 'Choco Frappe', price: 80 },
            { id: 'c2', name: 'Caramel Frappe', price: 90 },
            { id: 'c3', name: 'K.K Frappe (Special)', price: 99 },
            { id: 'c4', name: 'Vanilla Frappe', price: 90 },
            { id: 'c5', name: 'Espresso', price: 50 },
            { id: 'c6', name: 'Indian Latte', price: 50 },
            { id: 'c7', name: 'Caramel Latte', price: 60 },
            { id: 'c8', name: 'Hot Chocolate', price: 60 },
            { id: 'c9', name: 'Hazelnut Latte', price: 70 },
            { id: 'c10', name: 'Cold Coffee (Normal)', price: 90 },
            { id: 'c11', name: 'Hazelnut Frappe', price: 90 },
            { id: 'c12', name: 'Red Velvet Coffee', price: 99 },
            { id: 'c13', name: 'Double Choco Frappe', price: 120 }
        ]
    },

    mocktails: {
        name: '🍹 Mocktails & Iced Tea',
        items: [
            { id: 'mo1', name: 'American Lime', price: 70 },
            { id: 'mo2', name: 'Green Apple', price: 70 },
            { id: 'mo3', name: 'Blood Orange', price: 80 },
            { id: 'mo4', name: 'Watermelon Lemonade', price: 80 },
            { id: 'mo5', name: 'Italian Soda', price: 70 },
            { id: 'mo6', name: 'Mint Passion Fruit', price: 70 },
            { id: 'mo7', name: 'Rus Berry', price: 80 },
            { id: 'mo8', name: 'Peach Ice Tea', price: 70 },
            { id: 'mo9', name: 'Lemon Ice Tea', price: 70 },
            { id: 'mo10', name: 'Thai Ice Tea', price: 80 },
            { id: 'mo11', name: 'Fruit Beer', price: 60 },
            { id: 'mo12', name: 'Nojito', price: 80 },
            { id: 'mo13', name: 'Dirty Coconut Coke', price: 99 },
            { id: 'mo14', name: 'Mint Masala Soda', price: 70 },
            { id: 'mo15', name: 'Pina Colada', price: 90 },
            { id: 'mo16', name: 'Strawberry Lemonade', price: 80 }
        ]
    },

    combos: {
        name: '🍽️ Meals / Combos',
        items: [
            { id: 'co1', name: 'Classic Meal', price: 180, description: 'Aloo Tikki Burger + Fries + Shake', popular: true },
            { id: 'co2', name: 'Supreme Meal', price: 189, description: 'Paneer Tikka Burger + Cold Coffee' },
            { id: 'co3', name: 'Ultimate Meal', price: 199, description: 'Veg Sandwich + Fries + Shake', popular: true },
            { id: 'co4', name: 'Supreme BBQ Meal', price: 259, description: 'BBQ Grill Burger + Fries + American Lime' },
            { id: 'co5', name: 'On-The-Go Meal', price: 150, description: 'Veg Delight Sub + Lemon Ice Tea' },
            { id: 'co6', name: 'Four Season Combo', price: 299, description: 'Onion + Tomato + Corn + Capsicum Pizza Small' },
            { id: 'co7', name: 'B-Town Combo', price: 279, description: '2 Single Topping Medium + 2 Fruit Beer' },
            { id: 'co8', name: 'Special Taco Town Combo', price: 179, description: '1 Single Topping Medium + Half Fries + Green Apple Mojito' },
            { id: 'co9', name: 'All-in-One Combo', price: 559, description: 'Farmhouse Large + Half Fries + 2 Choco Lava Cakes + 2 Peach Ice Tea', popular: true },
            { id: 'co10', name: 'Delight Combo', price: 279, description: 'Veg Delight Medium + Full Fries + Butter Scotch Shake' },
            { id: 'co11', name: 'Garlic & Chocolate Love Combo', price: 249, description: 'Stuffed Garlic Bread + Choco Lava Cake + Peach Ice Tea' }
        ]
    }
};

module.exports = menuData;

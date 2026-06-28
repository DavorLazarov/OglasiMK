const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// Помошна функција за генерирање македонски мобилен број
function generateRandomPhone() {
    const prefixes = ["070", "071", "072", "075", "076", "077", "078"];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    // Генерира 6 случајни цифри
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `${randomPrefix}${randomDigits}`;
}

async function main() {
    console.log('Започнува бришење на старите огласи...');
    await prisma.ad.deleteMany({});
    await prisma.favorite.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('Проверка/Креирање на двата тест корисници...');

    const hashedPass1 = await bcrypt.hash("davor123", 10);
    const hashedPass2 = await bcrypt.hash("jana123", 10);

    const корисник1 = await prisma.user.upsert({
        where: { email: "davor@oglasi.mk" },
        update: {},
        create: {
            email: "davor@oglasi.mk",
            password: hashedPass1,
            name: "Давор Лазаров"
        }
    });

    const корисник2 = await prisma.user.upsert({
        where: { email: "jana@oglasi.mk" },
        update: {},
        create: {
            email: "jana@oglasi.mk",
            password: hashedPass2,
            name: "Јана Еленова"
        }
    });

    console.log('Внесување на 40 огласи со системски клучни зборови за категории...');
    const oglasi = [
        // === VEHICLES (Возила) ===
        { title: "Volkswagen Golf 7 2.0 TDI", description: "Увезен од Германија, платени давачки.", price: 12500, category: "vehicles", location: "Скопје", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600", phone: "070123456" },
        { title: "Audi A4 2.0 TDI S-Line", description: "Регистриран цела година со зелен картон.", price: 14200, category: "vehicles", location: "Битола", image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600", phone: "075234567" },
        { title: "BMW 320d F30 LCI", description: "Сочуван максимално, купен од прв сопственик.", price: 15800, category: "vehicles", location: "Охрид", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600", phone: "078345678" },
        { title: "Opel Astra K 1.6 CDTI", description: "Економична градска кола со ниска потрошувачка.", price: 9400, category: "vehicles", location: "Тетово", image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600", phone: "071456789" },
        { title: "Ford Focus 1.5 TDCi Titanium", description: "Одличен семеен автомобил, купен во МК.", price: 10200, category: "vehicles", location: "Куманово", image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600", phone: "076567890" },
        { title: "Renault Megane 1.5 dCi Bose", description: "Највисоко ниво на опрема, панорама кров.", price: 11100, category: "vehicles", location: "Скопје", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600", phone: "077678901" },
        { title: "Mercedes-Benz C220 CDI Avantgarde", description: "Автоматик, зачуван ентериер со кожни седишта.", price: 13500, category: "vehicles", location: "Тетово", image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=600", phone: "072789012" },

        // === REAL ESTATE (Недвижнини) ===
        { title: "Стан во Аеродром 65м2", description: "Се продава двособен стан кај Тобако 2. Кат 4 со лифт.", price: 91000, category: "real-estate", location: "Скопје", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600", phone: "070987654" },
        { title: "Куќа во Куманово на мирна локација", description: "Куќа од 120м2 со дворно место од 300м2.", price: 65000, category: "real-estate", location: "Куманово", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600", phone: "075876543" },
        { title: "Апартман во Охрид со поглед на езеро", description: "Луксузен апартман од 45м2 во близина на Центар.", price: 78000, category: "real-estate", location: "Охрид", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600", phone: "071765432" },
        { title: "Двособен стан во Нова Битола", description: "Се продава стан од 58м2 на 2-ри кат.", price: 62000, category: "real-estate", location: "Битола", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600", phone: "078654321" },
        { title: "Издавам деловен простор во Центар", description: "45м2 во близина на Влада. Погоден за канцеларија.", price: 350, category: "real-estate", location: "Скопје", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600", phone: "076543210" },
        { title: "Плац за градба во Тетово", description: "Градежно земјиште од 500м2 со маркица за куќа.", price: 25000, category: "real-estate", location: "Тетово", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600", phone: "077432109" },

        // === ELECTRONICS (Електроника) ===
        { title: "iPhone 15 Pro 256GB Titanium", description: "Купен од iStyle, под гаранција уште 14 месеци.", price: 950, category: "electronics", location: "Битола", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600", phone: "070111222" },
        { title: "Sony PlayStation 5 Slim", description: "Нов, неотпакуван со 2 контролери и игра.", price: 520, category: "electronics", location: "Куманово", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600", phone: "075333444" },
        { title: "Лаптоп ASUS ROG Strix G15", description: "Gaming лаптоп Ryzen 7, RTX 3060, 16GB RAM.", price: 850, category: "electronics", location: "Скопје", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600", phone: "078555666" },
        { title: "Samsung Galaxy S24 Ultra 512GB", description: "Нов неотпакуван телефон со македонска гаранција.", price: 1100, category: "electronics", location: "Тетово", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600", phone: "071777888" },
        { title: "Паметен телевизор LG 55\" 4K OLED", description: "Врвен квалитет на слика, купен пред 6 месеци.", price: 790, category: "electronics", location: "Скопје", image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600", phone: "076999000" },
        { title: "MacBook Air M2 8GB/256GB", description: "Space Gray боја, батерија на 98% здравје.", price: 900, category: "electronics", location: "Охрид", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600", phone: "077222333" },

        // === FURNITURE (Мебел) ===
        { title: "Аголна гарнитура за дневна соба", description: "Се продава многу зачувана аголна гарнитура.", price: 450, category: "furniture", location: "Скопје", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600", phone: "070444555" },
        { title: "Трпезариска маса со 6 столици", description: "Маса од полно дрво (медијапан) на расклопување.", price: 300, category: "furniture", location: "Битола", image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600", phone: "075666777" },
        { title: "Двоен плакар со лизгачки врати", description: "Модерен плакар со огледало, димензии 200х220цм.", price: 220, category: "furniture", location: "Куманово", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600", phone: "078888999" },
        { title: "Брачен кревет со душек Дормео", description: "Димензии 160х200 со простор за складирање.", price: 350, category: "furniture", location: "Охрид", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600", phone: "071000111" },
        { title: "Комода за телевизор високо сјај", description: "Бела модерна комода со ЛЕД осветлување.", price: 120, category: "furniture", location: "Тетово", image: "https://images.unsplash.com/photo-1602872030219-cbf947a449fc?w=600", phone: "076222333" },
        { title: "Клуб маса за дневна соба", description: "Мала стаклена клуб маса со дрвени ногарки.", price: 60, category: "furniture", location: "Скопје", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600", phone: "077444555" },

        // === JOBS (Работа) ===
        { title: "Се бара келнер/ка за ресторан", description: "Потребен е персонал за постојана работа во ресторан.", price: 600, category: "jobs", location: "Скопје", image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=600", phone: "070555666" },
        { title: "Оглас за готвач во хотел во Охрид", description: "Потребен е главен кувар со работно искуство.", price: 1200, category: "jobs", location: "Охрид", image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600", phone: "075777888" },
        { title: "Потребен продавач во бутик во Центар", description: "Работа во две смени, почетна плата со бонуси.", price: 450, category: "jobs", location: "Битола", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600", phone: "078999000" },
        { title: "Автомеханичар со искуство во сервис", description: "Потребен е еден автомеханичар за брз сервис.", price: 800, category: "jobs", location: "Тетово", image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600", phone: "071222444" },
        { title: "Возач на камион (Ц и Е категорија)", description: "Фирма има потреба од возач за меѓународен транспорт.", price: 1500, category: "jobs", location: "Куманово", image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600", phone: "076444888" },

        // === SERVICES (Услуги) ===
        { title: "Професионално молерисување", description: "Вршиме молерисување, глетвање и спуштени тавани.", price: 5, category: "services", location: "Скопје", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600", phone: "070333999" },
        { title: "Генерално чистење на станови", description: "Професионална екипа врши комплетно чистење.", price: 50, category: "services", location: "Битола", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600", phone: "075444999" },
        { title: "Водоинсталатер и итни интервенции", description: "Поправка и замена на водоводна мрежа 24/7.", price: 20, category: "services", location: "Охрид", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600", phone: "078555999" },
        { title: "Монтажа и сервис на клима уреди", description: "Сервисирање и монтажа на сите видови инвертер клими.", price: 40, category: "services", location: "Тетово", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600", phone: "071666999" },
        { title: "Изработка на веб страни", description: "Изработка на модерни веб сајтови во Next.js.", price: 250, category: "services", location: "Скопје", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600", phone: "077888999" }
    ];

    for (let i = 0; i < oglasi.length; i++) {
        const oglas = oglasi[i];
        const сопственик = (i % 2 === 0) ? корисник1 : корисник2;

        await prisma.ad.create({
            data: {
                title: oglas.title,
                description: oglas.description,
                price: oglas.price,
                category: oglas.category,
                location: oglas.location,
                image: oglas.image,
                phone: generateRandomPhone(), // ПОПРАВКА: Го додаваме случајниот телефонски број ТУКА
                author: {
                    connect: { id: сопственик.id }
                }
            },
        });
    }

    console.log('Базата е успешно сидирана со точните преведувачки клучеви и телефонски броеви!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
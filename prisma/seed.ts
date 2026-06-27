const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
async function main() {
    await prisma.favorite.deleteMany()
    await prisma.ad.deleteMany()
    await prisma.user.deleteMany()
    const hashedPassword = await bcrypt.hash("123123", 10)

    const davor = await prisma.user.create({
        data: {
            email: "davor@example.com",
            password: hashedPassword,
            name: "Davor",
        },
    })

    const jana = await prisma.user.create({
        data: {
            email: "jana@example.com",
            password: hashedPassword,
            name: "Jana",
        },
    })

    const ads = [
        // --- ПРЕТХОДНИТЕ 6 ---
        {
            title: "Audi A4 2.0 TDI S-Line",
            description: "Увезена од Германија, со сервисна книшка и реални километри. Full опрема.",
            price: 18500,
            category: "vehicles",
            location: "Скопје",
            image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=800&q=80",
            userId: davor.id,
            phone: "070111222",
            email: davor.email,
            details: JSON.stringify({ brand: "Audi", model: "A4", year: 2019, fuelType: "Дизел" })
        },
        {
            title: "Луксузен стан со поглед на езеро",
            description: "Станот е во нова зграда, веднаш до кејот. Идеален за фамилија или за издавање.",
            price: 120000,
            category: "real-estate",
            location: "Охрид",
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
            userId: jana.id,
            phone: "078555444",
            email: jana.email,
            details: JSON.stringify({ area: 85, rooms: 3, propertyType: "Стан" })
        },
        {
            title: "MacBook Pro M2 14-inch",
            description: "Користен само неколку месеци, без никаква гребнатинка. Батерија на 100%.",
            price: 1600,
            category: "electronics",
            location: "Битола",
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
            userId: davor.id,
            phone: "075333999",
            email: davor.email,
            details: JSON.stringify({ condition: "Како нов" })
        },
        {
            title: "Се бара Готвач за ресторан",
            description: "Потребно е претходно искуство. Одлични услови и почетна плата.",
            price: 800,
            category: "jobs",
            location: "Тетово",
            image: "https://images.unsplash.com/photo-1577100078279-b3445dee847c?auto=format&fit=crop&w=800&q=80",
            userId: jana.id,
            phone: "044123456",
            email: jana.email,
            details: JSON.stringify({ jobType: "Полно работно време" })
        },
        {
            title: "Аголна гарнитура од природна кожа",
            description: "Купена пред една година, добро сочувана. Се продава поради преселба.",
            price: 450,
            category: "furniture",
            location: "Куманово",
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
            userId: davor.id,
            phone: "071222444",
            email: davor.email,
            details: JSON.stringify({ condition: "На старо" })
        },
        {
            title: "Професионално молерисување",
            description: "Брза и квалитетна изведба на сите видови внатрешно уредување.",
            price: 5,
            category: "services",
            location: "Скопје",
            image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
            userId: jana.id,
            phone: "072666777",
            email: jana.email,
            details: JSON.stringify({ serviceType: "Градежништво" })
        },

        // --- НОВИТЕ 10 ОГЛАСИ ---
        {
            title: "BMW 320d M-Sport",
            description: "Перфектна состојба, ниска потрошувачка, регистрирана цела година.",
            price: 22000,
            category: "vehicles",
            location: "Битола",
            image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
            userId: davor.id,
            phone: "070111222",
            email: davor.email,
            details: JSON.stringify({ brand: "BMW", model: "320d", year: 2020, fuelType: "Дизел" })
        },
        {
            title: "Викендица во Маврово",
            description: "Прекрасна викендица опкружена со шума, комплетно реновирана минатата година.",
            price: 65000,
            category: "real-estate",
            location: "Тетово",
            image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
            userId: jana.id,
            phone: "078555444",
            email: jana.email,
            details: JSON.stringify({ area: 120, rooms: 4, propertyType: "Куќа" })
        },
        {
            title: "Sony PlayStation 5 + 2 џојстици",
            description: "Малку користен, доаѓа со 3 игри и преостаната гаранција од 6 месеци.",
            price: 480,
            category: "electronics",
            location: "Скопје",
            image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
            userId: davor.id,
            phone: "075333999",
            email: davor.email,
            details: JSON.stringify({ condition: "Користен" })
        },
        {
            title: "Програмер (Frontend React)",
            description: "Се бара искусен React програмер за работа на меѓународни проекти.",
            price: 2500,
            category: "jobs",
            location: "Скопје",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
            userId: davor.id,
            phone: "070000111",
            email: davor.email,
            details: JSON.stringify({ jobType: "Далечински" })
        },
        {
            title: "Трпезариска маса од масивно дрво",
            description: "Рачна изработка, уникатен дизајн, димензии 200x100цм.",
            price: 350,
            category: "furniture",
            location: "Охрид",
            image: "https://images.unsplash.com/photo-1530018607912-eff2df114f11?auto=format&fit=crop&w=800&q=80",
            userId: jana.id,
            phone: "078555444",
            email: jana.email,
            details: JSON.stringify({ material: "Даб" })
        },
        {
            title: "Транспорт на мебел и роба",
            description: "Вршиме транспорт низ цела Македонија со сопствено комбе. Брзо и сигурно.",
            price: 30,
            category: "services",
            location: "Куманово",
            image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
            userId: davor.id,
            phone: "071222444",
            email: davor.email,
            details: JSON.stringify({ serviceType: "Транспорт" })
        },
        {
            title: "Samsung Galaxy S24 Ultra",
            description: "Неотпакуван, титаниум црна боја. Купен од Телеком.",
            price: 1050,
            category: "electronics",
            location: "Куманово",
            image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
            userId: jana.id,
            phone: "071999888",
            email: jana.email,
            details: JSON.stringify({ condition: "Нов" })
        },
        {
            title: "Mercedes-Benz C220 AMG",
            description: "Атрактивен изглед, сервисна историја, сочуван ентериер.",
            price: 25000,
            category: "vehicles",
            location: "Скопје",
            image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
            userId: davor.id,
            phone: "070111222",
            email: davor.email,
            details: JSON.stringify({ brand: "Mercedes", year: 2021 })
        },
        {
            title: "Плац во прва линија до море",
            description: "Атрактивна локација за изградба на хотел или луксузна вила.",
            price: 300000,
            category: "real-estate",
            location: "Охрид",
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
            userId: jana.id,
            phone: "078555444",
            email: jana.email,
            details: JSON.stringify({ area: 1500, propertyType: "Плац" })
        },
        {
            title: "Курсеви по Англиски јазик",
            description: "Индивидуални часови за почетници и напредни нивоа. Подготовка за IELTS.",
            price: 10,
            category: "services",
            location: "Битола",
            image: "https://images.unsplash.com/photo-1543165796-5426273dfbb3?auto=format&fit=crop&w=800&q=80",
            userId: jana.id,
            phone: "071555666",
            email: jana.email,
            details: JSON.stringify({ serviceType: "Едукација" })
        }
    ]

    for (const ad of ads) {
        await prisma.ad.create({ data: ad })
    }

    console.log("Успешно додадени 16 огласи!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
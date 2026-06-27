export interface Ad {
  id: string
  title: string
  description: string
  price: number
  category: "vehicles" | "real-estate" | "electronics" | "jobs" | "services" | "furniture"
  location: string
  image: string | null
  createdAt: string
  userId: string
  userName: string
  phone?: string
  email?: string
  // Vehicle specific
  brand?: string
  model?: string
  year?: number
  mileage?: number
  fuelType?: string
  // Real estate specific
  area?: number
  rooms?: number
  propertyType?: string
  condition?: string
  // Jobs specific
  jobType?: string
  salary?: string
  // Services specific
  serviceType?: string
  // Furniture specific
  furnitureType?: string
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
}

export const LOCATIONS = ["Скопје", "Битола", "Охрид", "Тетово", "Куманово"] as const

export const FUEL_TYPES = ["Бензин", "Дизел", "Електричен", "Хибрид", "ТНГ"] as const

export const PROPERTY_TYPES = ["Стан", "Куќа", "Деловен простор", "Земјиште"] as const

export const CONDITION_TYPES = [
  "Ново",
  "Користено - како ново",
  "Користено - добра состојба",
  "Користено - оштетено",
] as const

export const JOB_TYPES = ["Полно работно време", "Скратено работно време", "Хонорарно", "Практикант"] as const

export const SERVICE_TYPES = ["Поправки", "Чистење", "Превоз", "Настава", "Градежништво", "Друго"] as const

export const FURNITURE_TYPES = [
  "Софи и гарнитури",
  "Маси и столици",
  "Кревети",
  "Плакари",
  "Канцелариски",
  "Друго",
] as const

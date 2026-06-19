import { PrismaClient, ViolenceType } from '@prisma/client'

const prisma = new PrismaClient()

const VICTIMS = [
  { name_ar: 'محمد ع.', age: 32, city: 'أم الفحم',      lat: 32.517, lng: 35.152, violence_type: 'shooting' as ViolenceType, date_of_death: new Date('2023-04-12'), bio_ar: 'أب لطفلين، كان يعمل سائقاً ويحلم بافتتاح مشروعه الخاص.', status: 'published' as const },
  { name_ar: 'ليلى م.', age: 41, city: 'باقة الغربية', lat: 32.419, lng: 35.038, violence_type: 'domestic' as ViolenceType, date_of_death: new Date('2022-08-03'), bio_ar: 'معلمة لغة عربية، عُرفت بحبها لطلابها وتفانيها في عملها.', status: 'published' as const },
  { name_ar: 'سمير ح.', age: 27, city: 'الناصرة',      lat: 32.702, lng: 35.298, violence_type: 'shooting' as ViolenceType, date_of_death: new Date('2023-11-20'), bio_ar: 'طالب هندسة ميكانيكية، كان على وشك التخرج من جامعة حيفا.', status: 'published' as const },
  { name_ar: 'يوسف ك.', age: 19, city: 'شفاعمرو',      lat: 32.806, lng: 35.171, violence_type: 'shooting' as ViolenceType, date_of_death: new Date('2024-02-07'), bio_ar: 'طالب ثانوي كان يحلم بالالتحاق بكلية الطب.', status: 'published' as const },
  { name_ar: 'هناء ص.', age: 35, city: 'طمرة',          lat: 32.856, lng: 35.196, violence_type: 'domestic' as ViolenceType, date_of_death: new Date('2023-03-28'), bio_ar: 'معلمة رياضيات وقائدة مبادرات لتعليم الفتيات.', status: 'published' as const },
]

async function main() {
  console.log('Seeding database...')
  for (const v of VICTIMS) {
    await prisma.victim.upsert({
      where:  { id: v.name_ar }, // placeholder — in prod use a stable unique field
      update: {},
      create: v as any,
    })
  }
  console.log(`Seeded ${VICTIMS.length} victims`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

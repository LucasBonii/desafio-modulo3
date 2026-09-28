import { Pet, Prisma } from "@prisma/client";

export interface FindAllParams {
  city: string
  age?: 'PUPPY' | 'ADULT' | 'SENIOR'
  size?: 'SMALL' | 'MEDIUM' | 'LARGE'
  energy_level?: 'LOW' | 'MEDIUM' | 'HIGH'
  independence_level?: 'LOW' | 'MEDIUM' | 'HIGH'
}

export interface PetsRepository{
    findById(id:string): Promise<Pet | null>
    findAll(params: FindAllParams): Promise<Pet[]>
    create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
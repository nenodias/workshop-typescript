import { ObjectId } from "mongodb";

export default class Customer {
    constructor(public nome: string, public idade: number, public uf: string, public _id?: ObjectId) { }
}
import type { WithId, Document } from 'mongodb';
import { ObjectId } from "mongodb";

export default interface Customer extends WithId<Document> {
    nome: string;
    idade: number;
    uf: string;
    _id: ObjectId;
}
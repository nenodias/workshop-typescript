import { MongoClient, ObjectId, Db } from "mongodb";
import ICustomer from "./interfaces/ICustomer";
import Customer from "./model/Customer";
import { config } from "dotenv";
config();

let connection: Db | null = null;
const throwMongoError = () => { throw new Error("Mongo URL was not passed") };
const getUrl = () => process.env.MONGO_URL ?? throwMongoError();


const getConnection = async (): Promise<Db> => {
    if (connection != null) {
        return Promise.resolve(connection);
    }
    try {
        let db: Db = await MongoClient.connect(getUrl()).then(conn => conn.db());
        connection = db;
        return Promise.resolve(connection);
    } catch (err: any) {
        console.error(err);
        throw new Error(err);
    }
};

const toDTO = (i: Customer) => ({ _id: i._id?.toString(), nome: i.nome, idade: i.idade, uf: i.uf } as ICustomer)
const toEntity = (customer: ICustomer) => {
    const { nome, idade, uf } = customer;
    let _id = new ObjectId(customer._id ?? undefined); 
    let model = { nome, idade, uf, _id } as Customer;
    return model;
};

const findAll = async (): Promise<ICustomer[]> => {
    try {
        let conn: Db = await getConnection();
        let customers = await (conn.collection('customers').find({}).toArray()) as Customer[];
        return customers.map(toDTO);
    } catch (err: any) {
        console.error(err);
        throw new Error(err);
    }
};

const insert = async (customer: ICustomer): Promise<ICustomer> => {
    try {
        let conn: Db = await getConnection();
        let model = toEntity(customer);
        let retorno = await conn.collection('customers').insertOne(model);
        return findOne(retorno.insertedId.toString());
    } catch (err: any) {
        console.error(err);
        throw new Error(err);
    }
};

const deleteOne = async (id: string): Promise<boolean> => {
    try {
        let conn: Db = await getConnection();
        await conn.collection('customers').deleteOne({ _id: new ObjectId(id) });
        return true;
    } catch (err: any) {
        console.error(err);
    }
    return false;
};

const findOne = async (id: string): Promise<ICustomer> => {
    try {
        let conn: Db = await getConnection();
        let customer = await conn.collection('customers').findOne({ _id: new ObjectId(id) }) as Customer;
        return toDTO(customer);
    } catch (err: any) {
        console.error(err);
    }
    return Promise.reject(`ID ${id} not found.`);
};

const update = async (id: string, customer: ICustomer): Promise<ICustomer> => {
    try {
        let conn: Db = await getConnection();
        let model = toEntity(customer);
        let retorno = await conn.collection('customers').updateOne({ _id: new ObjectId(id) }, { $set: model});
        return findOne(retorno.upsertedId.toString());
    } catch (err: any) {
        console.error(err);
        throw new Error(err);
    }
};



export default {
    findAll, insert, deleteOne, findOne, update
}
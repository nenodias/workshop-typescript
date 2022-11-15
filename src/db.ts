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

const findAll = async (): Promise<ICustomer[]> => {
    try {
        let conn: Db = await getConnection();
        let customers = await (conn.collection('customers').find({}).toArray()) as Customer[];
        return customers.map(i => ({ _id: i._id?.toString(), nome: i.nome, idade: i.idade, uf: i.uf } as ICustomer));
    } catch (err: any) {
        console.error(err);
        throw new Error(err);
    }
};

const insert = async (customer: ICustomer): Promise<ICustomer> => {
    try {
        let conn: Db = await getConnection();
        let model = new Customer(customer.nome, customer.idade, customer.uf);
        if (customer._id !== null) {
            model._id = new ObjectId(model._id);
        }
        await conn.collection('customers').insertOne(model);
        return customer;
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

export default {
    findAll, insert, deleteOne
}
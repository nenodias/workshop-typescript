import { Router, Request, Response } from "express";
import ICustomer from "../interfaces/ICustomer";
import db from "../db";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const docs: ICustomer[] = await db.findAll();
    res.render('index', { docs: docs });
});

router.get('/delete/:id', async (req: Request, res: Response) => {
    let id = req.params.id;
    await db.deleteOne(id);
    res.redirect('/');
});

router.get('/new', async (req: Request, res: Response) => {
    res.render('new', { title: 'Novo Cadastro' });
});

router.post('/new', async (req: Request, res: Response) => {
    const nome = req.body.nome;
    const idade = parseInt(req.body.idade);
    const uf = req.body.uf;
    await db.insert({ nome, idade, uf } as ICustomer);
    res.redirect('/');
});

export default router;

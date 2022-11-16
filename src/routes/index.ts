import { Router, Request, Response } from "express";
import ICustomer from "../interfaces/ICustomer";
import db from "../db";

const router = Router();

const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", 
    "ES", "GO", "MA", "MT", "MS", "MG", "PA", 
    "PB", "PR", "PE", "PI", "RJ", "RN", "RS", 
    "RO", "RR", "SC", "SP", "SE", "TO"
];


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
    res.render('new', { title: 'Novo Cadastro', estados });
});

router.post('/new', async (req: Request, res: Response) => {
    const nome = req.body.nome;
    const idade = parseInt(req.body.idade);
    const uf = req.body.uf;
    await db.insert({ nome, idade, uf } as ICustomer);
    res.redirect('/');
});

router.get('/edit/:id', async (req: Request, res: Response) => {
    var id = req.params.id;
    let doc = await db.findOne(id);
    res.render('edit', { doc, title: "Editar Cadastro", estados });
  });
  
  router.post('/edit', async (req: Request, res: Response) => {
    const _id = req.body._id;
    const nome = req.body.nome;
    const idade = parseInt(req.body.idade);
    const uf = req.body.uf;
    const customer = { nome, idade, uf, _id } as ICustomer;
    await db.update(_id, customer);
    res.redirect('/');
  });

export default router;

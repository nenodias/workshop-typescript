import createError from "http-errors";
import express from "express";
import { Router, Request, Response, NextFunction } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import * as path from "path";


import indexRouter from "./routes/index";

const app = express();
const PORT = parseInt(process.env.PORT ?? "3000");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

app.listen(PORT, () => `Server is listening on port ${PORT}`);

import { type Request, type Response } from 'express';

export type AsyncHandler = (req: Request, res: Response) => Promise<void>;

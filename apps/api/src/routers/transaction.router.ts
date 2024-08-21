import { Router } from 'express';
import { TransactionController } from '@/controllers/transaction.controller'; 

export class TransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  public constructor() {
    this.router = Router();
    this.transactionController = new TransactionController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/transaction', this.transactionController.createTransaction);
    this.router.get('/transaction/:id', this.transactionController.readTransaction);
    this.router.put('/transaction/:id', this.transactionController.updateTransaction);
    this.router.delete('/transaction/:id', this.transactionController.deleteTransaction);
  }

  public getRouter(): Router {
    return this.router;
  }
}


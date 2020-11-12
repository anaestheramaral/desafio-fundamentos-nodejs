import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, type, value }: RequestDTO): Transaction {
    // TODO -- should not allow to withdraw more than you have
    // for that we need the balance (get from the repository)
    const { total } = this.transactionsRepository.getBalance();
    const checkType = ['income', 'outcome'];
    if (!checkType.includes(type)){
      throw Error('Invalid option');
    }
    if (type === 'outcome' && value > total) {
      throw Error('Transaction not authorized: Insuficient funds');
    }
    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;

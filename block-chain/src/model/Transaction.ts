import { TxIn } from "./TxIn";
import { TxOut } from "./TxOut";

export class Transaction {
    public id!: string;
    public txIns!: TxIn[];
    public txOuts!: TxOut[];
}
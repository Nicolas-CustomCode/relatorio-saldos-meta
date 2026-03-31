import { pgAccount } from "@/src/types/business";
import Row from "./Row";
import styles from "@/src/styles/components/table.module.css"

export default function Table({ data }: { data: pgAccount[] }) {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Nome</th>
                    <th>Mínimo</th>
                    <th>Atual</th>
                    <th>Status</th>
                    <th>Atualizado</th>
                    <th>Tipo</th>
                </tr>
            </thead>
            <tbody>
                {data.map((account) => (
                    account.show && <Row key={account.id} data={account}></Row>
                ))}
            </tbody>
        </table>
    )
}

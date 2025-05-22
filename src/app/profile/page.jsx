"use client";

import styles from "./profile.module.css";
import { Button, Card } from "antd";
import Image from "next/image";
import Link from "next/link";

export default function Profile() {
    return (
        <div className={styles.container}>
        <Card className={styles.card}>
            <div className={styles.imageContainer}>
            <Image src="/images/giovanna.jpg" alt="Profile Picture" fill className={styles.image}/>
            </div>
            <h2>Giovanna Alba Gomes, 2TDS1</h2>
                <p>💻 Docentes Thiago Ferreira e Marcelo Carboni</p>
                <p>🛡️ Neste projeto de front-end irei apresentar minha API de heróis e suas editoras</p>
            <Link href="/heroes">
                <Button className={styles.button}>Acesse aqui a API de Heroes</Button>
            </Link>
        </Card>
        </div>
    )
}
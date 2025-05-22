"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./heroes.module.css";
import axios from "axios";
import { Pagination, Modal, Card, Skeleton } from "antd";
import Image from "next/image";
import { toast } from "react-toastify";
import Charger from "../../components/Charger";

const HEADERS = { "x-api-key": process.env.NEXT_PUBLIC_API_KEY };

export default function Heroes() {
    const [data, setData] = useState({
        heroes: [],
        loading: true,
        current: 1,
        pageSize: 0,
    });

    const [modalInfo, setModalInfo] = useState({
        visible: false,
        hero: null,
        publisher: null,
        loading: false,
    });

    const heroCacheRef = useRef([]);
    const publisherCacheRef = useRef(new Map());

    useEffect(() => {
        const fetchHeroes = async () => {
            setData((d) => ({ ...d, loading:true}));

            if (heroCacheRef.current.length > 0) {
                setData((d) => ({
                    ...d,
                    heroes: heroCacheRef.current,
                    loading: false,
                }));
                return;
            }

            try {
                const { data: heroes } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/heroes`, 
                    {
                        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                    }
                );
                alunoCacheRef.current = heroes;
                setData((d) => ({
                    ...d,
                    heroes,
                    loading: false,
                }));
            } catch (error) {
                console.error("Erro ao buscar os heróis:", error);
                toast.error("Erro ao carregar os heróis");
                setData((d) => ({ ...d, loading: false }));
            }
        };

        fetchHeroes();
    }, []);

    const openModal = async (hero) => {
        const cacheKey = hero.id;
        setModalInfo({ visible: true, hero, loading: true });

        if (publisherCacheRef.current.has(cacheKey)) {
            const publisher = publisherCacheRef.current.get(cacheKey);
            setModalInfo((prev) => ({ ...prev, publisher, loading: false }));
            return;
        }

        try {
            const { data: publisher } = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/publishers/${hero.publisher}`,
                {
                    headers: HEADERS,
                }
            );
            publisherCacheRef.current.set(cacheKey, publisher);
            setModalInfo((prev) => ({ ...prev, publisher, loading: false }));
        } catch (error) {
            console.error("Erro ao buscar a editora:", error);
            toast.error("Erro ao carregar a editora");
            setModalInfo((prev) => ({ ...prev, loading: false }));
        };

        const paginationHeroes = () => {
            const start = (data.current - 1) * data.pageSize;
            return data.heroes.slice(start, start + data.pageSize);
        };

        return (
            <div>
                <h1>Lista de Heróis</h1>

                <Pagination 
                current={data.current}
                pageSize={data.pageSize}
                total={data.heroes.length}
                onChange={(page, pageSize) => setData((d) => ({ ...d, current: page, pageSize }))
                }
                showSizeChanger
                pageSizeOptions={["5", "10", "20"]}
                />

                {data.loading ? (
                    <div className={`${styles.loading} ${data.loading ? "" : styles.hidden}`}>
                        <Charger />
                    </div>
                ) : (
                    <div className={styles.cardsContainer}>
                        {paginationHeroes().map((hero) => (
                            <Card 
                            key={hero.id}
                            className={styles.card}
                            hoverable
                            onClick={() => openModal(hero)}
                            cover={
                                <Image 
                                alt={hero.name}
                                src={hero.photo ? hero.photo : "/images/220x220.svg"}
                                width={220}
                                height={220}
                                />
                            }
                            >
                                <Card.Meta 
                                title={hero.name}
                                />
                            </Card>
                        ))}

                    </div>
                )}
            </div>
        )}

        <Modal
            title={`Editora de ${modalInfo.hero.name}`}
            open={modalInfo.visible}
            onCancel={() => 
                setModalInfo({
                    visible: false,
                    hero: null,
                    publisher: null,
                    loading: false,
                })
            }
            onOk={() => 
                setModalInfo({
                    visible: false,
                    hero: null,
                    publisher: null,
                    loading: false,
                })
            }
            width={600}
            >
                {modalInfo.loading ? (
                    <Skeleton active />
                ) : modalInfo.publisher ? (
                    <div className={styles.publisherInfo}>
                        <p>
                            <span className={styles.label}>Nome:</span>{" "}
                            {modalInfo.publisher.name}
                        </p>
                    </div>
                ) : (
                <p style={{ textAlign: "center"}}>Editora não foi encontrada!</p>
                )}
        </Modal>
}
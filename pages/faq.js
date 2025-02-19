import React from 'react'
import Head from 'next/head'

import Accordion from '../components/Accordion'

import styles from '../styles/Accordion.module.css'

export default function Faq() {
  return (
    <main className={styles.main}>
      <Head>
        <title>Cutie Hack | FAQ</title>
      </Head>
      <div className={styles.faq}>
        <h1 className={styles.header}>Questions?</h1>
        <p className={styles.description}>
          Here are the most commonly asked questions. Feel free to ask us any
          question you don&apos;t see on here.
        </p>
        <Accordion />
      </div>
    </main>
  )
}

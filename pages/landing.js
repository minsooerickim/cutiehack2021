import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { nanoid } from 'nanoid'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import CountdownWrapper from '../components/Countdown'

import heroLeft from '../public/assets/hero_left.png'
import heroRight from '../public/assets/hero_right.png'
import heroMobile from '../public/assets/hero_mobile.png'
import { FaCircle } from 'react-icons/fa'

import styles from '../styles/Index.module.css'

export default function Home() {
  const router = useRouter()
  const [session] = useSession()

  const [isMobile, setIsMobile] = useState(false)
  var buttonVariants = {}
  var windowVariants = {}
  if (!isMobile) {
    buttonVariants = {
      hover: { scale: 1.05 },
      tap: { scale: 0.995 },
    }
    windowVariants = {
      whileDrag: { scale: 1.05 },
    }
  }

  const [checkedIn, setCheckedIn] = useState(false)
  const [inGroup, setInGroup] = useState(false)
  const [groupId, setGroupId] = useState('')

  const constraintsRef = useRef(null)

  const fetchData = async (userId) => {
    const response = await fetch('/api/checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: userId }),
    })
    const data = await response.json()
    setCheckedIn(Object.keys(data.checkins).length !== 0)
    if (data.checkins[0]) {
      setInGroup(data.checkins[0].groupId !== '')
      if (data.checkins[0].groupId !== '') {
        setGroupId(data.checkins[0].groupId)
      }
    }
  }

  const createGroup = async (userId, userName) => {
    const groupId = nanoid()
    const response = await fetch('/api/groups/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ group: [groupId, userId, userName] }),
    })
    await response.json()
    toast.success('Successfully created a group!', { id: 'createGroupSuccess' })
    const dst = '/groups/' + groupId.toString()
    router.push(dst)
  }

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 720)
  }

  useEffect(() => {
    if (session) fetchData(session.user.id)
    window.addEventListener('resize', handleResize)
    setIsMobile(window.innerWidth <= 720)
  })

  return (
    <>
      <div className={`${styles.bgWrap} ${styles.desktopimage}`}>
        <Image
          src={heroLeft}
          alt="Hero Image"
          objectFit="contain"
          quality={100}
          placeholder="blur"
        />
        <Image
          src={heroRight}
          alt="Hero Image"
          objectFit="contain"
          quality={100}
          placeholder="blur"
        />
      </div>
      <div className={`${styles.bgWrap} ${styles.mobileimage}`}>
        <Image
          src={heroMobile}
          alt="Hero Image"
          objectFit="contain"
          quality={100}
          placeholder="blur"
          className={styles.mobileimage}
        />
      </div>
      <section className={styles.main}>
        <motion.div ref={constraintsRef} className={styles.intro}>
          <motion.div
            variants={windowVariants}
            drag={!isMobile}
            dragConstraints={constraintsRef}
            whileDrag="whileDrag"
            dragMomentum={false}
            style={{
              ...(!isMobile ? { x: 0, y: 0 } : {}),
            }}
            className={styles.window}
          >
            <div className={styles.windowHeader}>
              <FaCircle className={styles.windowButton} />
              <FaCircle className={styles.windowButton} />
              <FaCircle className={styles.windowButton} />
            </div>
            <div className={styles.windowContent}>
              {session && (
                <h1 className={styles.greeting}>
                  Glad to have you, {session.user.name}!
                </h1>
              )}
              <div>
                <h1 className={styles.title}>cutie hack</h1>
                <CountdownWrapper />
                {!session && isMobile && (
                  <div className={styles.actionwrapper}>
                    <motion.button
                      aria-label="Sign In Button"
                      type="button"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      transition="ease"
                      className={styles.primarybutton}
                      onClick={signIn}
                    >
                      Sign in
                    </motion.button>
                  </div>
                )}
                {session && isMobile && !checkedIn && (
                  <div className={styles.actionwrapper}>
                    <Link passHref href="/checkin">
                      <motion.button
                        aria-label="Check In Button"
                        type="button"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        transition={{ ease: 'easeInOut', duration: 0.015 }}
                        className={styles.primarybutton}
                      >
                        Check In
                      </motion.button>
                    </Link>
                  </div>
                )}
                {session && isMobile && inGroup && (
                  <div className={styles.actionwrapper}>
                    <Link passHref href={'/groups/' + groupId}>
                      <motion.button
                        aria-label="View Group Button"
                        type="button"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        transition={{ ease: 'easeInOut', duration: 0.015 }}
                        className={styles.primarybutton}
                      >
                        View Your Group
                      </motion.button>
                    </Link>
                  </div>
                )}
                {session && checkedIn && !inGroup && (
                  <div className={styles.actionwrapper}>
                    <motion.button
                      aria-label="Create Group Button"
                      type="button"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      transition={{ ease: 'easeInOut', duration: 0.015 }}
                      className={styles.primarybutton}
                      onClick={() =>
                        createGroup(session.user.id, session.user.name)
                      }
                    >
                      Create Group
                    </motion.button>
                    <Link passHref href="/groups/join">
                      <motion.button
                        aria-label="Join Group Button"
                        type="button"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        transition={{ ease: 'easeInOut', duration: 0.015 }}
                        className={styles.primarybutton}
                      >
                        Join a Group
                      </motion.button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {!session && <>{/* <h1>You are not signed in</h1> */}</>}
      </section>
    </>
  )
}

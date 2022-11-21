import styles from '../styles/Home.module.css'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { getSupabase } from '../utils/supabase'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Index = ({ user }) => {
  const [cvs, setCvs] = useState([])
  const supabase = getSupabase(user.accessToken)

  useEffect(() => {
    const fetchTodos = async () => {
      const { data } = await supabase.from('cv').select('*')
      console.log(data)
      setCvs(data)
    }

    fetchTodos()
  }, [])

  return (
    <div className={styles.container}>
      <p>
        Welcome {user.name}!{' '}
        <Link href="/api/auth/logout">
          Logout
        </Link>
      </p>
      {cvs?.length > 0 ? (
        cvs.map((cv) => <p key={cv.id}>{cv.name}</p>)
      ) : (
        <p>You have completed all todos!</p>
      )}
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default Index
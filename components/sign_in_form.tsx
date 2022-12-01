'use client';

import {getSupabase} from "../utils/supabase";
import {SyntheticEvent, useState} from "react";
import {useRouter} from "next/navigation";

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function signUpWithEmail(e: SyntheticEvent) {
    e.preventDefault();

    setMessage('');
    const { data, error } = await getSupabase().auth.signInWithPassword({
      email, //: 'example@email.com',
      password, //: 'example-password',
    })
    if (error) {
      setMessage(error.message)
    } else {
      await router.push('/');
    }
  }

  function renderMessage() {
    if (!message) return null;

    return (
      <div>
        Result: {message}
      </div>
    )
  }

  return (
    <form onSubmit={signUpWithEmail}>
      <div>
        <label>
          Email
          <input type={"email"} onChange={({ target: {value }}) => {
            setEmail(value);
          }} value={email}/>
        </label>
      </div>
      <div>
        <label>
          Password
          <input type={"password"} onChange={({ target: {value }}) => {
            setPassword(value);
          }} value={password}/>
        </label>
      </div>
      <button>Sign In</button>
      {renderMessage()}
    </form>
  )
}
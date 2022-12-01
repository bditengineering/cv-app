'use client';

import {getSupabase} from "../utils/supabase";
import {ChangeEvent, SyntheticEvent, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {CV} from "./types";

const attributes = ['first_name', 'last_name'];

interface Props {
  id?: string
}

export default function AddNewCvForm({ id } : Props) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<CV>>({
    first_name: '',
    last_name: '',
  });
  const [message, setMessage] = useState('');

  async function fetchCv() {
    const { data } = await getSupabase().from('cv').select('*').eq('id', id);
    if (data && data.length === 1) {
      const formData = attributes.reduce((acc, attr) => {
        acc[attr as keyof CV] = data[0][attr];
        return acc;
      }, {} as Partial<CV>);

      setForm(formData);
    }
  }

  async function upsert() {
    if (id) {
      return getSupabase().from('cv').update(form).eq('id', id);
    }

    const {data: {session}} = await getSupabase().auth.getSession();
    return getSupabase().from('cv').insert({
      ...form,
      created_by: session?.user.id
    });
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setMessage('');

    const {data, error} = await upsert();
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
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { target: { name, value }} = e;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  }

  useEffect(() => {
    fetchCv();
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          First Name
          <input name="first_name" type="text" onChange={handleChange} value={form.first_name}/>
        </label>
      </div>
      <div>
        <label>
          Last Name
          <input name="last_name" type="text" onChange={handleChange} value={form.last_name}/>
        </label>
      </div>
      <button>{id ? 'Save' : 'Add'}</button>
      {renderMessage()}
    </form>
  )
}
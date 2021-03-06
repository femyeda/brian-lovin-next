import * as React from 'react'
import { PrimaryButton } from '~/components/Button'
import { Input } from '~/components/Input'

export default function OverthoughtSubscribeBox() {
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState('pending')
  const [errorMessage, setErrorMessage] = React.useState('')

  function onChange(e) {
    if (status !== 'pending') setStatus('pending')
    return setEmail(e.target.value.trim())
  }

  async function submit(e) {
    e.preventDefault()

    const res = await fetch('/api/newsletter', {
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })

    const { error } = await res.json()

    if (error) {
      setStatus('error')
      setErrorMessage(error)
      return
    }

    setEmail('')
    setStatus('succeeded')
  }

  return (
    <div
      className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 flex flex-col space-y-3"
      data-cy="overthought-subscribe-box"
    >
      <h5 className="flex items-center">
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingRight: '16px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 16 16 12 12 8"></polyline>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </span>
        Follow along
      </h5>
      <p>
        If you want to know about new posts, add your email below.
        Alternatively, you can{' '}
        <a
          href="https://overthought.ghost.io/rss/"
          target="_blank"
          rel="noopener noreferrer"
        >
          subscribe with RSS
        </a>
        .
      </p>
      {status === 'succeeded' ? (
        <p className="text-white rounded bg-green-500 p-3 text-center">
          Thanks for subscribing!
        </p>
      ) : (
        <form onSubmit={submit} className="flex space-x-3">
          <label className="flex flex-1">
            <span className="sr-only">Email address</span>
            <Input
              value={email}
              disabled={status === 'loading'}
              onChange={onChange}
              placeholder="Email address"
              id="subscribe-email"
              type="email"
              name="email"
            />
          </label>
          <PrimaryButton
            onClick={submit}
            disabled={status === 'submitting' || !email}
            type="submit"
          >
            Subscribe
          </PrimaryButton>
        </form>
      )}
      {status === 'error' && (
        <p className="text-white rounded bg-red-500 p-3 text-center">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

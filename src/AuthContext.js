import React, { useEffect, useState, createContext} from 'react'
import { fb } from '../src/firebase'

export const AuthContext  = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [pending, setPending] = useState(true)

  useEffect(() => {
    fb.auth().onAuthStateChanged((user) => {
      setCurrentUser(user)
      setPending(false)
    })
  }, [])

  if(pending) {
    return <> Loading... </>
  }

  return (
    <AuthContext.Provider
      value={{currentUser}}
    >
      {children}
    </AuthContext.Provider>
  )
}
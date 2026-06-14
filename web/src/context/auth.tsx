import React, { createContext, useState } from "react"

interface AuthUser {
    id: string,
    token: string
}

export interface AuthState {
    isAuthenticated: boolean
    user: AuthUser | null
    setUser: (user: AuthUser) => void
    logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)
const key = 'tanstack.auth.user'

const isAuthUser = (val: unknown): val is AuthUser => {
    if (typeof val === "object" && val !== null && "id" in val && "token" in val) {
        const { id, token } = val;
        if (typeof id === "string" && typeof token === "string") return true
    }
    return false
}

const getStoredUser = () => {
    const val = localStorage.getItem(key)
    if (!val) return null

    try {
        const user = JSON.parse(val)
        if (!isAuthUser(user)) return null
        return user
    } catch {
        return null
    }
}

const setStoredUser = (user: AuthUser | null) => {
    if (user) {
        localStorage.setItem(key, JSON.stringify(user))
    } else {
        localStorage.removeItem(key)
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(getStoredUser())
    const isAuthenticated = Boolean(user)

    const logout = () => {
        setStoredUser(null)
        setUser(null)
    }

    const handleSetUser = (user: AuthUser) => {
        setStoredUser(user)
        setUser(user)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setUser: handleSetUser, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = React.useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
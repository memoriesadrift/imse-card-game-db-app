import { Alert, CircularProgress } from '@mui/material'
import React from 'react'

type QueryGuardProps<T> = {
    isLoading: boolean
    error: unknown
    data: T
    children: ((data: Exclude<T, undefined>) => JSX.Element | null) | JSX.Element
  }
  
  function isDefined<T>(data: T): data is Exclude<T, undefined> {
    return data !== undefined
  }
  
  export function QueryGuard<T>({
    isLoading, error, data, children
  }: QueryGuardProps<T>) {
  
    if (error) {
      return <Alert severity="error">An error occured while fetching data.</Alert>
    }
    if (isDefined(data)) {
      return typeof children === 'function' ? children(data) : children
    }
    return (isLoading) ? <CircularProgress size={26} /> : null
  }
  
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
      return (
        <div className="uk-alert-danger uk-card uk-card-body 
        uk-margin-medium-left uk-margin-medium-right" uk-alert>
            <p>An error occured while fetching data...</p>
        </div>            
        )
    }
    if (isDefined(data)) {
      return typeof children === 'function' ? children(data) : children
    }
    return (isLoading) ? <p>Loading...</p> : null
  }
  
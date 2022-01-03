import React from 'react'
import FullPageLoading from './visual/FullPageLoading'

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
        <div className="uk-alert-danger uk-card uk-card-default uk-width-1-2@m uk-align-center" uk-alert>
          <div className='uk-card-body'>
            <h5 className='uk-text-emphasis'>An error occured while fetching data...</h5>
          </div>
        </div>            
        )
    }
    if (isDefined(data)) {
      return typeof children === 'function' ? children(data) : children
    }
    return (isLoading) ? <FullPageLoading /> : null
  }
  
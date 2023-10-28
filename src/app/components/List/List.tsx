import React, { useRef } from 'react';
import { v4 as uuid } from 'uuid';

export default function List({ 
  elements, ListItem, styles = null, className = "", ids = "", unwrapped = false 
}: {
  elements: any[], ListItem: JSX.Element, styles: any, className: string, ids: string, unwrapped: boolean
}): JSX.Element {
  const listRef = useRef(null);

  if (unwrapped) { 
    return (
      <> 
        { 
          //@ts-ignore
          elements.map(element => { return <ListItem itemData={ element } key={ element.id ?? uuid() }/> }) 
        }
      </>
    )
  }

  return (
    <ul 
      className={ className } 
      id={ ids } 
      ref={ listRef } 
      style={ styles }//@ts-ignore
      children={ elements.map(element => { return <ListItem itemData={ element } key={ element.id ?? uuid() }/> }) }
    />
  )
}
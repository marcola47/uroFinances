import React, { useRef } from 'react';
import { v4 as uuid } from 'uuid';

export default function List({ 
  elements, ListItem, className = "", ids = "", unwrapped = false 
}: {
  elements: any[], ListItem: any, className: string, ids: string, unwrapped: boolean
}): JSX.Element {
  const listRef = useRef(null);

  if (unwrapped)
    return <> { elements.map(element => { return <ListItem itemData={ element } key={ element.id ?? uuid() }/> }) }</>

  return (
    <ul 
      className={ className } 
      id={ ids } 
      ref={ listRef } 
      children={ elements.map(element => { return <ListItem itemData={ element } key={ element.id ?? uuid() }/> }) }
    />
  )
}
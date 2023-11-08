import React, { RefObject, useRef, useImperativeHandle } from 'react';
import { useUserContext } from '@/app/context/User';
import { v4 as uuid } from 'uuid';

export default function List({ 
  elements, 
  ListItem, 
  className = "", 
  ids = "",
  style = {},
  forwardedRef
}: {
  elements: any[], 
  ListItem: any, 
  className: string, 
  ids: string,
  style: any,
  forwardedRef: RefObject<HTMLUListElement | null>;
}): JSX.Element {
  const { user } = useUserContext();
  const listRef = useRef<HTMLUListElement | null>(null);
  useImperativeHandle(forwardedRef, () => listRef.current);
  
  return (
    <ul 
      className={`${user?.settings?.hide_scrollbars ? "hide-scrollbar" : ""} ${className}`} 
      id={ ids } 
      style={ style }
      ref={ listRef } 
      children={ elements.map(element => { return <ListItem itemData={ element } key={ element.id ?? uuid() }/> }) }
    />
  )
}
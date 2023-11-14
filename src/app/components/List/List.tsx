import { RefObject, useRef, useImperativeHandle } from 'react';
import { useUserContext } from '@/app/context/User';
import { v4 as uuid } from 'uuid';

type ListProps = {
  className?: string, 
  id?: string,
  elements: any[], 
  ListItem: any, 
  style?: any,
  forwardedRef?: RefObject<HTMLUListElement | null>;
}

export default function List({ className = "", id = "", elements, ListItem, style = {}, forwardedRef }: ListProps): JSX.Element {
  const { user } = useUserContext();
  const listRef = useRef<HTMLUListElement | null>(null);
  useImperativeHandle(forwardedRef, () => listRef.current);
  
  return (
    <ul 
      className={`${user?.settings?.hide_scrollbars ? "hide-scrollbar" : ""} ${className}`} 
      id={ id } 
      style={ style }
      ref={ listRef } 
      children={ elements.map(element => { return <ListItem itemData={ element } key={ element.id ?? uuid() }/> }) }
    />
  )
}
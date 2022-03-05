import { NavLink } from 'react-router-dom';

export default function PageLink(props) {
    let label = props.type === 'prev' ? " ❮ " : (props.type === 'next' ? " ❯ " : ` ${props.type} `);
    return (
        <NavLink className={`${props.addClass} ${props.type} pagesLink ${(props.link === props.current ? 'activePage' : 'plain')}`} to={`?page=${props.link}`}>{label}</NavLink> 
    )
}

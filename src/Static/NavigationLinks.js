import { NavLink } from 'react-router-dom';

export default function NavigationLinks() {
    return (
    <nav>
        <span className="menu-item-wrapper brick">
            <NavLink to="/leagues" className="brick">Лиги</NavLink>
        </span>
        <span className="menu-item-wrapper brick">
            <NavLink to="/teams" className="brick">Команды</NavLink>
        </span>
    </nav>
    )
}
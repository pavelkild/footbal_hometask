import { NavLink } from "react-router-dom";

function NotFoundPage () {
    return (
        <main>
            <div className="container flex row-12">
                <div className="wrap fullWidth text-center">
                    <h1 className="giantHeader">404</h1>
                    <p class="cleanText text-lg">Cтраница не найдена<br/><NavLink to="/leagues" className="underlined">Перейти на главную?</NavLink></p>
                </div>
            </div>
            
        </main>
    )
}

export default NotFoundPage;
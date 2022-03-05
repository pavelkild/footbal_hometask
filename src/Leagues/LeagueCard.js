import { Component } from "react";
import { NavLink } from 'react-router-dom';

class LeagueCard extends Component {
    constructor(props) {
        super(props);
        this.state = { called: false };
    }

    render() {
        const {item} = this.props;

        return (
            <div className="LeagueItem text-center col-3 pushLeft nopadding relative" >
                <NavLink to={"show/" + item.id}>
                <div className="LeagueItemWrapper pointer">
                    <div className="headLine"></div>
                    <h3 className="leagueName headerFont normal flex"><span className="brick fullWidth">{item.name}</span></h3>
                    <h4 className="muted">{item.area.name}</h4>
                </div>
                </NavLink>
            </div>
        )
    }
}

export default LeagueCard;
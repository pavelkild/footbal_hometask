import { Component } from "react";
import { NavLink } from 'react-router-dom';
import './breadCrumbs.css'

class BreadCrumbs extends Component {
    constructor(props) {
        super(props);

        this.state = { ready: true };
    }

    Crumb = (props) => {
        const {crumbInfo} = props;
        
        return crumbInfo.link === "" ? (
            <span className="crumbs lastCrumb">{crumbInfo.label}</span>
        ) : (
            <NavLink className="crumbs" to={crumbInfo.link} >{crumbInfo.label}</NavLink>
        );
    }

    render() {
        let crumbs = [
            {label: process.env.REACT_APP_SITE_TITLE, link: '/', id: 0},
            {label: this.props.categoryLink.label, link: this.props.categoryLink.link, id: 1},
            {label: this.props.current.label , link: "" , id: 2},
        ];
        
        return (
            <div id="breadCrumbs">
                <nav>
                {crumbs.map(item => <this.Crumb crumbInfo={item} key={item.id} />)}
                </nav>
            </div>
        );
    }
}

export default BreadCrumbs;